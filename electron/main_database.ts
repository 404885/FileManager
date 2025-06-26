import path from 'path';
import {ipcMain, IpcMainInvokeEvent} from 'electron';
import {createRequire} from 'module';
import {ElTreeNode, FileNode, VXETableNode} from "@/utils/type.ts";

const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');


let db: InstanceType<typeof Database> | null = null;

export function initDatabase() {
    // const dbPath = path.join(app.getPath('userData'), 'FileManager.db');
    const dbPath = path.join(process.cwd(), 'FileManager.db');

    db = new Database(dbPath);

    db.exec(`PRAGMA foreign_keys = ON;`);

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
      type TEXT NOT NULL DEFAULT 'folder',
      connected_workspace INTEGER DEFAULT 1,
      associated_folder INTEGER NULL DEFAULT NULL,
      create_time INTEGER,
      last_browse_time INTEGER,
      FOREIGN KEY (connected_workspace)
        REFERENCES workspace(id)
        ON DELETE CASCADE,
      FOREIGN KEY (associated_folder)
        REFERENCES portfolio(id)
        ON DELETE CASCADE
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
      associated_folder INTEGER NULL DEFAULT NULL,
      create_time INTEGER,
      last_browse_time INTEGER,
      FOREIGN KEY (connected_workspace)
        REFERENCES workspace(id)
        ON DELETE CASCADE,
      FOREIGN KEY (associated_folder)
        REFERENCES portfolio(id)
        ON DELETE CASCADE
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
    ipcMain.handle('saveFileToDb', async (_e, file: FileNode, workspace: number) => {
        if (!db) initDatabase();
        const now = Date.now();

        try {
            const stmt = db.prepare(`
              INSERT INTO file
                (name, connected_workspace, file_size, file_path, type, create_time, last_browse_time)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            const result = stmt.run(
                file.name,
                workspace,
                file.size ?? 0,
                file.path,
                path.extname(file.name).substring(1),
                file.birthtime?.getTime() ?? now,
                file.atime?.getTime()      ?? now
            );

            if (result.changes === 1) {
                return { success: true, lastInsertRowid: result.lastInsertRowid };
            } else {
                // 极少会发生 INSERT changes === 0 的情况
                return { success: false, reason: 'no rows inserted' };
            }
        } catch (err: any) {
            console.error('插入文件失败：', err);
            return { success: false, error: err.message };
        }
    });

    ipcMain.handle('saveDirectoryToDb', async (_e, files: FileNode, workspace: number) => {
        if (!db) initDatabase();
        const now = Date.now();

        // 1. 插入根目录
        const rootInfo = db!.prepare(`
        INSERT INTO portfolio (name, connected_workspace, create_time, last_browse_time)
        VALUES (?, ?, ?, ?)
      `).run(
            files.name,
            workspace,
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

                    if (node.children) {
                        // 目录节点
                        const info = db!.prepare(`
                            INSERT INTO portfolio
                              (name, connected_workspace, associated_folder, create_time, last_browse_time)
                            VALUES (?, ?, ?, ?, ?)
                          `).run(
                            node.name,
                            workspace,
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
                          (name, connected_workspace, file_size, file_path, type, associated_folder, create_time, last_browse_time)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                      `).run(
                            node.name,
                            workspace,
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

            // 每次取 100 条
            const batch = queue.splice(0, 100);
            insertBatch(batch);

            // 下一轮异步调度
            setImmediate(processQueue);
        }

        // 开始处理
        processQueue();

        return { success: true };
    });
    ipcMain.handle('loadTree', async (_e: IpcMainInvokeEvent, workspace: number, _keyword?: string) => {
        if (!db) initDatabase();

        let rows: any[];
        const portfolios = db.prepare(`
              SELECT *,
                     0 AS isLeaf, 0 AS marked
              FROM portfolio
              WHERE connected_workspace = ?
            `).all(workspace);

        const files = db.prepare(`
              SELECT *,
                     create_time, last_browse_time,
                     1 AS isLeaf, 0 AS marked
              FROM file
              WHERE connected_workspace = ?
            `).all(workspace);

        rows = [...portfolios, ...files];

        // const safeKeyword = (keyword || '').trim();
        // const likePattern = `%${safeKeyword}%`;
        // if (!safeKeyword) {
        //     // —— 无关键词：直接拿全表（portfolio + file），不标记 —— //
        //     const portfolios = db.prepare(`
        //       SELECT id, name, NULL AS file_size, NULL AS file_path, type,
        //              connected_workspace, associated_folder,
        //              create_time, last_browse_time,
        //              0 AS isLeaf, 0 AS marked
        //       FROM portfolio
        //       WHERE connected_workspace = ?
        //     `).all(workspace);
        //
        //             const files = db.prepare(`
        //       SELECT id, name, file_size, file_path, type,
        //              connected_workspace, associated_folder,
        //              create_time, last_browse_time,
        //              1 AS isLeaf, 0 AS marked
        //       FROM file
        //       WHERE connected_workspace = ?
        //     `).all(workspace);
        //
        //     rows = [...portfolios, ...files];
        //
        // } else {
        //     // —— 有关键词：CTE + GROUP BY + MAX(marked) —— //
        //     const sql = `
        //       WITH RECURSIVE result AS (
        //         SELECT id, name, file_size, file_path, type,
        //                connected_workspace, associated_folder,
        //                create_time, last_browse_time,
        //                1 AS isLeaf, 1 AS marked
        //         FROM file
        //         WHERE connected_workspace = ? AND name LIKE ?
        //
        //         UNION ALL
        //
        //         SELECT id, name, NULL AS file_size, NULL AS file_path, type,
        //                connected_workspace, associated_folder,
        //                create_time, last_browse_time,
        //                0 AS isLeaf, 1 AS marked
        //         FROM portfolio
        //         WHERE connected_workspace = ? AND name LIKE ?
        //
        //         UNION ALL
        //
        //         SELECT p.id, p.name, NULL AS file_size, NULL AS file_path, p.type,
        //                p.connected_workspace, p.associated_folder,
        //                p.create_time, p.last_browse_time,
        //                0 AS isLeaf, 0 AS marked
        //         FROM portfolio p
        //         JOIN result r ON p.id = r.associated_folder
        //         WHERE p.connected_workspace = ?
        //       )
        //       SELECT
        //         id, name, file_size, file_path, type,
        //         connected_workspace, associated_folder,
        //         create_time, last_browse_time,
        //         isLeaf,
        //         MAX(marked) AS marked
        //       FROM result
        //       GROUP BY id;
        //     `;
        //     const stmt = db.prepare(sql);
        //     rows = stmt.all(
        //         workspace, likePattern,
        //         workspace, likePattern,
        //         workspace
        //     );
        // }

        // —— 通用：把 rows 映射成 ElTreeNode —— //
        const nodes: ElTreeNode[] = rows.map(row => ({
            ...row,
            label: row.name,
            isLeaf: Boolean(row.isLeaf),
            uniqueKey: (row.isLeaf ? 'f_' : 'p_') + row.id,
            // 无关键词时 marked 统一为 false；有关键词则用 SQL 标记
            marked: Boolean(row.marked)
        }));

        // —— 构造 childrenMap —— //
        const childrenMap = new Map<number, ElTreeNode[]>();
        childrenMap.set(0, []);
        for (const node of nodes) {
            // 把 null 或 undefined 的父 ID 归到 0
            const key = node.associated_folder ?? 0;
            if (!childrenMap.has(key)) {
                childrenMap.set(key, []);
            }
            childrenMap.get(key)!.push(node);
        }

        // —— 递归生成树 —— //
        function buildTree(parentId: number): ElTreeNode[] {
            const list = childrenMap.get(parentId) || [];
            for (const node of list) {
                if (!node.isLeaf) {
                    const kids = buildTree(node.id);
                    if (kids.length) node.children = kids;
                }
            }
            return list;
        }

        return buildTree(0);
    });

    ipcMain.handle("loadTable", async (_e: IpcMainInvokeEvent, workspace: number, associatedFolder:number | null = null) => {
        if (!db) initDatabase();

        let portfolios: any[];
        let files: any[];

        if (associatedFolder != null) {
            // 有传 folderId，就只拿那一层的子项
            portfolios = db
                .prepare(`SELECT * FROM portfolio WHERE connected_workspace = ? AND associated_folder = ?`)
                .all(workspace, associatedFolder);
            files = db
                .prepare(`SELECT * FROM file WHERE connected_workspace = ? AND associated_folder = ?`)
                .all(workspace, associatedFolder);
        } else {
            // 没传 folderId，就只拿根目录（associated_folder IS NULL）
            portfolios = db
                .prepare(`SELECT * FROM portfolio WHERE connected_workspace = ? AND associated_folder IS NULL`)
                .all(workspace);

            files = db
                .prepare(`SELECT * FROM file WHERE connected_workspace = ? AND associated_folder IS NULL`)
                .all(workspace);
        }

        const rows = [...portfolios, ...files];
        const nodes: VXETableNode[] = rows.map((row) => ({
            ...row,
            uniqueKey: (row.type !== 'folder' ? "f_" : "p_") + row.id,
            parentId: row.associated_folder != null ? "p_" + row.associated_folder : null,
        }));
        return nodes;
    });

    ipcMain.handle('loadTableV2', async (_e: IpcMainInvokeEvent, workspace: number)=> {
        if (!db) initDatabase();

        let rows: any[];
        const portfolios = db.prepare(`SELECT * FROM portfolio WHERE connected_workspace = ?`).all(workspace);

        const files = db.prepare(`SELECT * FROM file WHERE connected_workspace = ?`).all(workspace);

        rows = [...portfolios, ...files];

        const nodes: VXETableNode[] = rows.map(row => ({
            ...row,
            uniqueKey: (row.type !== 'folder' ? 'f_' : 'p_') + row.id,
            parentId: 'p_' + row.associated_folder,
        }));

        return nodes;

    });


    // ipcMain.handle('loadAll', () => {
    //     if (!db) initDatabase();
    //
    //     function loadTreeFromDb(): ElTreeNode[] {
    //
    //         // 1. 读取所有目录（portfolio）和文件（file）
    //         const portfolios: Array<{
    //             id: number;
    //             name: string;
    //             type: string;
    //             associated_folder: number|null;
    //             create_time: number;
    //             last_browse_time: number;
    //             connected_workspace:number;
    //             isLeaf:0 | 1;
    //         }> = db!.prepare(`
    //         SELECT * ,0 AS isLeaf FROM portfolio
    //       `).all();
    //
    //         const files: Array<{
    //             id: number;
    //             name: string;
    //             file_size: number;
    //             file_path: string;
    //             type: string;
    //             associated_folder: number|null;
    //             connected_workspace:number;
    //             create_time: number;
    //             last_browse_time: number;
    //             isLeaf:0 | 1;
    //         }> = db!.prepare(`
    //         SELECT *, 1 AS isLeaf FROM file
    //       `).all();
    //
    //         // 2. 构建一个通用的 Map：parentId -> 子节点列表
    //         const childrenMap = new Map<number, ElTreeNode[]>();
    //
    //         // helper：往 map 里 push
    //         function pushChild(parentId: number | null, node: ElTreeNode) {
    //             const key = parentId ?? 0;            // null 或者 undefined 都归为 0
    //             if (!childrenMap.has(key)) {
    //                 childrenMap.set(key, []);
    //             }
    //             childrenMap.get(key)!.push(node);
    //         }
    //
    //         // 3. 把所有目录先插入 map
    //         for (const p of portfolios) {
    //             const node: ElTreeNode = {
    //                 id: p.id,
    //                 label: p.name,
    //                 name: p.name,
    //                 type: p.type,
    //                 associated_folder: p.associated_folder,
    //                 isLeaf: p.isLeaf,
    //                 connected_workspace:p.connected_workspace
    //                 // children 会在后面自动填充
    //             };
    //             pushChild(p.associated_folder, node);
    //         }
    //
    //         // 4. 再把文件插入 map
    //         for (const f of files) {
    //             const node: ElTreeNode = {
    //                 id: f.id,          // 防止与目录 id 冲突，可选
    //                 label: f.name,
    //                 isLeaf: f.isLeaf,
    //                 file_path: f.file_path,
    //                 file_size: f.file_size,
    //                 associated_folder: f.associated_folder,
    //                 connected_workspace: f.connected_workspace,
    //                 name: f.name,
    //                 type: f.type
    //             };
    //             pushChild(f.associated_folder, node);
    //         }
    //
    //         // 5. 递归构建树：从 associated_folder = 0（根）开始
    //         function buildTree(parentId: number): ElTreeNode[] {
    //             const list = childrenMap.get(parentId) || [];
    //             for (const node of list) {
    //                 const kids = buildTree(node.id);
    //                 if (kids.length) {
    //                     node.children = kids;
    //                 }
    //             }
    //             return list;
    //         }
    //
    //         // 根节点 list
    //         return buildTree(0);
    //     }
    //
    //     return loadTreeFromDb();
    // });

}


