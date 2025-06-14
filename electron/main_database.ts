import path from 'path';
import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');


let db: InstanceType<typeof Database> | null = null;

interface FileNode {
    name: string
    path: string
    size?: number
    birthtime?: Date
    atime?: Date
    mtime?: Date
    children?: FileNode[] // 递归类型，表示目录结构
}


export function initDatabase() {
    const dbPath = path.join(process.cwd(), 'FileManager.db');

    db = new Database(dbPath);
    db.prepare(`
    CREATE TABLE IF NOT EXISTS workspace (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      create_time INTEGER,
      last_browse_time INTEGER
    )
  `).run();
    const row = db.prepare(`SELECT COUNT(*) as count FROM workspace`).get();

    if (row.count === 0) {
        const now = new Date().toISOString();
        db.prepare(`
        INSERT INTO workspace (name, create_time)
        VALUES (?, ?)
      `).run('默认工作空间', now);
    }
    db.prepare(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      connected_workspace INTEGER DEFAULT 1,
      associated_folder INTEGER DEFAULT 0,
      create_time INTEGER,
      last_browse_time INTEGER
    )
  `).run();
    db.prepare(`
    CREATE TABLE IF NOT EXISTS file (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      type TEXT NOT NULL,
      connected_workspace INTEGER DEFAULT 1,
      associated_folder INTEGER DEFAULT 0,
      create_time INTEGER,
      last_browse_time INTEGER
    )
  `).run();

    console.log('DataBase has initialized', dbPath);
}


export function RegisterDataBaseOperations() {
    ipcMain.handle('queryAll', async (_e: IpcMainInvokeEvent, sql: string, params: any[] = []) => {
        if (!db) initDatabase();
        return db.prepare(sql).all(params);  // 同步执行，但包装在 async 里
    });

    ipcMain.handle('queryOne', async (_e: IpcMainInvokeEvent, sql: string, params: any[] = []) => {
        if (!db) initDatabase();
        return db.prepare(sql).get(params);
    });

    ipcMain.handle('execute', async (_e: IpcMainInvokeEvent, sql: string, params: any[] = []) => {
        if (!db) initDatabase();
        return db.prepare(sql).run(params);  // 返回 { changes, lastInsertRowid }
    });

    ipcMain.handle('saveDirectoryToDb', async (e, files: FileNode) => {
        if (!db) initDatabase();
        const now = Date.now();

        // 1. 插入根目录
        const rootInfo = db!.prepare(`
        INSERT INTO portfolio (name, create_time, last_browse_time)
        VALUES (?, ?, ?)
      `).run(
            files.name,
            files.birthtime?.getTime() ?? now,
            files.atime?.getTime()      ?? now
        );
        const rootFolderId: number = rootInfo.lastInsertRowid;

        // 2. 设置初始队列和 parentMap
        const queue: FileNode[] = [];
        const parentMap = new Map<FileNode, number>();
        if (files.children) {
            for (const child of files.children) {
                parentMap.set(child, rootFolderId);
                queue.push(child);
            }
        }

        // 3. 分批处理函数
        function insertBatch(batch: FileNode[]) {
            db!.exec('BEGIN TRANSACTION');
            try {
                for (const node of batch) {
                    const parentId = parentMap.get(node)!;

                    if (node.children && node.children.length > 0) {
                        // 目录节点
                        const info = db!.prepare(`
                            INSERT INTO portfolio
                              (name, associated_folder, create_time, last_browse_time)
                            VALUES (?, ?, ?, ?)
                          `).run(
                            node.name,
                            parentId,
                            node.birthtime?.getTime() ?? now,
                            node.atime?.getTime()      ?? now
                        );
                        const thisFolderId = info.lastInsertRowid;

                        // 将子节点放入队列，并记录 parentMap
                        for (const child of node.children) {
                            parentMap.set(child, thisFolderId);
                            queue.push(child);
                        }

                    } else {
                        // 文件节点
                        db!.prepare(`
                        INSERT INTO file
                          (name, file_size, file_path, type, associated_folder, create_time, last_browse_time)
                        VALUES (?, ?, ?, ?, ?, ?, ?)
                      `).run(
                            node.name,
                            node.size ?? 0,
                            node.path,
                            path.extname(node.name).substring(1),
                            parentId,
                            node.birthtime?.getTime() ?? now,
                            node.atime?.getTime()      ?? now
                        );
                    }
                }

                db!.exec('COMMIT');
            } catch (err) {
                db!.exec('ROLLBACK');
                throw err;
            }
        }

        // 4. 分批异步执行
        function processQueue() {
            if (queue.length === 0) {
                // 全部处理完毕，返回成功
                e.sender.send('saveDirectoryToDb-progress', { done: true });
                return;
            }

            // 每次取 100 条
            const batch = queue.splice(0, 100);
            insertBatch(batch);

            // 可选：发送进度到渲染进程
            e.sender.send('saveDirectoryToDb-progress', {
                remaining: queue.length
            });

            // 下一轮异步调度
            setImmediate(processQueue);
        }

        // 开始处理
        processQueue();

        return { success: true };
    });

    interface ElTreeNode {
        id: number;
        label: string;
        children?: ElTreeNode[];
        isLeaf?: boolean;
        // 可按需加其他字段，如 fullPath、size 等
        fullPath?: string;
        size?: number;
    }
    ipcMain.handle('load-tree', () => {
        if (!db) initDatabase();

        function loadTreeFromDb(): ElTreeNode[] {

            // 1. 读取所有目录（portfolio）和文件（file）
            const portfolios: Array<{
                id: number;
                name: string;
                folder_path: string;
                associated_folder: number;
                create_time: number;
                last_browse_time: number;
            }> = db!.prepare(`
            SELECT id, name, associated_folder, create_time, last_browse_time
            FROM portfolio
          `).all();

            const files: Array<{
                id: number;
                name: string;
                file_size: number;
                file_path: string;
                type: string;
                associated_folder: number;
                create_time: number;
                last_browse_time: number;
            }> = db!.prepare(`
            SELECT id, name, file_size, file_path, type, associated_folder, create_time, last_browse_time
            FROM file
          `).all();

            // 2. 构建一个通用的 Map：parentId -> 子节点列表
            const childrenMap = new Map<number, ElTreeNode[]>();

            // helper：往 map 里 push
            function pushChild(parentId: number, node: ElTreeNode) {
                if (!childrenMap.has(parentId)) {
                    childrenMap.set(parentId, []);
                }
                childrenMap.get(parentId)!.push(node);
            }

            // 3. 把所有目录先插入 map
            for (const p of portfolios) {
                const node: ElTreeNode = {
                    id: p.id,
                    label: p.name,
                    // children 会在后面自动填充
                };
                pushChild(p.associated_folder, node);
            }

            // 4. 再把文件插入 map
            for (const f of files) {
                const node: ElTreeNode = {
                    id: f.id + 1000000,          // 防止与目录 id 冲突，可选
                    label: f.name,
                    isLeaf: true,
                    fullPath: f.file_path,
                    size: f.file_size,
                };
                pushChild(f.associated_folder, node);
            }

            // 5. 递归构建树：从 associated_folder = 0（根）开始
            function buildTree(parentId: number): ElTreeNode[] {
                const list = childrenMap.get(parentId) || [];
                for (const node of list) {
                    const kids = buildTree(node.id);
                    if (kids.length) {
                        node.children = kids;
                    }
                }
                return list;
            }

            // 根节点 list
            return buildTree(0);
        }

        return loadTreeFromDb();
    });



}


