import { ipcMain, BrowserWindow, dialog, shell, app } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs/promises";
import path$1 from "path";
import { createRequire } from "module";
function RegisterIpcEvent() {
  ipcMain.on("window-minimize", (event) => {
    const win2 = BrowserWindow.fromWebContents(event.sender);
    win2 == null ? void 0 : win2.minimize();
  });
  ipcMain.on("window-maximize", (event) => {
    const win2 = BrowserWindow.fromWebContents(event.sender);
    (win2 == null ? void 0 : win2.isMaximized()) ? win2 == null ? void 0 : win2.unmaximize() : win2 == null ? void 0 : win2.maximize();
  });
  ipcMain.on("window-close", (event) => {
    const win2 = BrowserWindow.fromWebContents(event.sender);
    win2 == null ? void 0 : win2.close();
  });
  ipcMain.on("window-pinned", (event, isPinned) => {
    const win2 = BrowserWindow.fromWebContents(event.sender);
    win2 == null ? void 0 : win2.setAlwaysOnTop(isPinned);
  });
  ipcMain.handle("open-file-dialog", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "All Files", extensions: ["*"] }]
    });
    if (canceled || filePaths.length === 0) return { canceled: true };
    const filePath = filePaths[0];
    const content = await fs.readFile(filePath, "utf-8");
    const stats = await fs.stat(filePath);
    const fileName = path.basename(filePath);
    return { canceled: false, name: fileName, path: filePath, content, stats };
  });
  ipcMain.handle("open-directory-dialog", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openDirectory"]
    });
    if (canceled || filePaths.length === 0) {
      return { canceled: true };
    }
    const directory = filePaths[0];
    async function walk(dir) {
      const list = await fs.readdir(dir, { withFileTypes: true });
      const children = [];
      for (const entry of list) {
        const fullPath = path.join(dir, entry.name);
        const s = await fs.stat(fullPath);
        if (entry.isDirectory()) {
          const subDir = await walk(fullPath);
          children.push({
            name: entry.name,
            path: fullPath,
            birthtime: s.birthtime,
            atime: s.atime,
            mtime: s.mtime,
            children: subDir
          });
        } else if (entry.isFile()) {
          children.push({
            name: entry.name,
            path: fullPath,
            size: s.size,
            birthtime: s.birthtime,
            atime: s.atime,
            mtime: s.mtime
          });
        }
      }
      return children;
    }
    const tree = {
      name: path.basename(directory),
      path: directory,
      children: await walk(directory)
    };
    return {
      canceled: false,
      files: tree
    };
  });
  ipcMain.handle("close-directory-dialog", async () => {
  });
  ipcMain.handle("open-file", async (_event, filePath) => {
    try {
      return await shell.openPath(filePath);
    } catch (err) {
      console.error("打开文件失败:", err);
      return "error";
    }
  });
}
const require2 = createRequire(import.meta.url);
const Database = require2("better-sqlite3");
let db = null;
function initDatabase() {
  const dbPath = path$1.join(process.cwd(), "FileManager.db");
  db = new Database(dbPath);
  db.exec(`PRAGMA foreign_keys = ON;`);
  db.prepare(`
    CREATE TABLE IF NOT EXISTS workspace (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      icon TEXT,
      create_time INTEGER,
      last_browse_time INTEGER,
      description TEXT
    )
  `).run();
  const row = db.prepare(`SELECT COUNT(*) as count FROM workspace`).get();
  if (row.count === 0) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    db.prepare(`
        INSERT INTO workspace (name, create_time)
        VALUES (?, ?)
      `).run("默认工作空间", now);
  }
  db.prepare(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'folder',
      description TEXT,
      tag TEXT,
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
      description TEXT,
      tag TEXT,
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
  console.log("DataBase has initialized", dbPath);
}
function RegisterDataBaseOperations() {
  ipcMain.handle("queryAll", async (_e, sql, params = []) => {
    if (!db) initDatabase();
    return db.prepare(sql).all(params);
  });
  ipcMain.handle("queryOne", async (_e, sql, params = []) => {
    if (!db) initDatabase();
    return db.prepare(sql).get(params);
  });
  ipcMain.handle("execute", async (_e, sql, params = []) => {
    if (!db) initDatabase();
    return db.prepare(sql).run(params);
  });
  ipcMain.handle("saveFileToDb", async (_e, file, workspace) => {
    var _a, _b;
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
        path$1.extname(file.name).substring(1),
        ((_a = file.birthtime) == null ? void 0 : _a.getTime()) ?? now,
        ((_b = file.atime) == null ? void 0 : _b.getTime()) ?? now
      );
      if (result.changes === 1) {
        return { success: true, lastInsertRowid: result.lastInsertRowid };
      } else {
        return { success: false, reason: "no rows inserted" };
      }
    } catch (err) {
      console.error("插入文件失败：", err);
      return { success: false, error: err.message };
    }
  });
  ipcMain.handle("saveDirectoryToDb", async (_e, files, workspace) => {
    var _a, _b;
    if (!db) initDatabase();
    const now = Date.now();
    const rootInfo = db.prepare(`
        INSERT INTO portfolio (name, connected_workspace, create_time, last_browse_time)
        VALUES (?, ?, ?, ?)
      `).run(
      files.name,
      workspace,
      ((_a = files.birthtime) == null ? void 0 : _a.getTime()) ?? now,
      ((_b = files.atime) == null ? void 0 : _b.getTime()) ?? now
    );
    const rootFolderId = rootInfo.lastInsertRowid;
    const queue = [];
    const parentMap = /* @__PURE__ */ new Map();
    if (files.children) {
      for (const child of files.children) {
        parentMap.set(child, rootFolderId);
        queue.push(child);
      }
    }
    function insertBatch(batch) {
      var _a2, _b2, _c, _d;
      db.exec("BEGIN TRANSACTION");
      try {
        for (const node of batch) {
          const parentId = parentMap.get(node);
          if (node.children) {
            const info = db.prepare(`
                            INSERT INTO portfolio
                              (name, connected_workspace, associated_folder, create_time, last_browse_time)
                            VALUES (?, ?, ?, ?, ?)
                          `).run(
              node.name,
              workspace,
              parentId,
              ((_a2 = node.birthtime) == null ? void 0 : _a2.getTime()) ?? now,
              ((_b2 = node.atime) == null ? void 0 : _b2.getTime()) ?? now
            );
            const thisFolderId = info.lastInsertRowid;
            for (const child of node.children) {
              parentMap.set(child, thisFolderId);
              queue.push(child);
            }
          } else {
            db.prepare(`
                        INSERT INTO file
                          (name, connected_workspace, file_size, file_path, type, associated_folder, create_time, last_browse_time)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                      `).run(
              node.name,
              workspace,
              node.size ?? 0,
              node.path,
              path$1.extname(node.name).substring(1),
              parentId,
              ((_c = node.birthtime) == null ? void 0 : _c.getTime()) ?? now,
              ((_d = node.atime) == null ? void 0 : _d.getTime()) ?? now
            );
          }
        }
        db.exec("COMMIT");
      } catch (err) {
        db.exec("ROLLBACK");
        throw err;
      }
    }
    function processQueue() {
      const batch = queue.splice(0, 100);
      insertBatch(batch);
      setImmediate(processQueue);
    }
    processQueue();
    return { success: true };
  });
  ipcMain.handle("loadTree", async (_e, workspace, _keyword) => {
    if (!db) initDatabase();
    let rows;
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
    const nodes = rows.map((row) => ({
      ...row,
      label: row.name,
      isLeaf: Boolean(row.isLeaf),
      uniqueKey: (row.isLeaf ? "f_" : "p_") + row.id,
      // 无关键词时 marked 统一为 false；有关键词则用 SQL 标记
      marked: Boolean(row.marked)
    }));
    const childrenMap = /* @__PURE__ */ new Map();
    childrenMap.set(0, []);
    for (const node of nodes) {
      const key = node.associated_folder ?? 0;
      if (!childrenMap.has(key)) {
        childrenMap.set(key, []);
      }
      childrenMap.get(key).push(node);
    }
    function buildTree(parentId) {
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
  ipcMain.handle("loadTable", async (_e, workspace, associatedFolder = null) => {
    if (!db) initDatabase();
    let portfolios;
    let files;
    if (associatedFolder != null) {
      portfolios = db.prepare(`SELECT * FROM portfolio WHERE connected_workspace = ? AND associated_folder = ?`).all(workspace, associatedFolder);
      files = db.prepare(`SELECT * FROM file WHERE connected_workspace = ? AND associated_folder = ?`).all(workspace, associatedFolder);
    } else {
      portfolios = db.prepare(`SELECT * FROM portfolio WHERE connected_workspace = ? AND associated_folder IS NULL`).all(workspace);
      files = db.prepare(`SELECT * FROM file WHERE connected_workspace = ? AND associated_folder IS NULL`).all(workspace);
    }
    const rows = [...portfolios, ...files];
    const nodes = rows.map((row) => ({
      ...row,
      uniqueKey: (row.type !== "folder" ? "f_" : "p_") + row.id,
      parentId: row.associated_folder != null ? "p_" + row.associated_folder : null
    }));
    return nodes;
  });
  ipcMain.handle("loadTableV2", async (_e, workspace) => {
    if (!db) initDatabase();
    let rows;
    const portfolios = db.prepare(`SELECT * FROM portfolio WHERE connected_workspace = ?`).all(workspace);
    const files = db.prepare(`SELECT * FROM file WHERE connected_workspace = ?`).all(workspace);
    rows = [...portfolios, ...files];
    const nodes = rows.map((row) => ({
      ...row,
      uniqueKey: (row.type !== "folder" ? "f_" : "p_") + row.id,
      parentId: "p_" + row.associated_folder
    }));
    return nodes;
  });
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 600,
    resizable: true,
    // 从public文件中找静态图片和图标等文件
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    frame: false,
    // 预加载文件在运行时的文件夹，实际实在dist-electron中
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
RegisterIpcEvent();
RegisterDataBaseOperations();
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow).then(initDatabase);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
