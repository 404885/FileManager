import { ipcMain, BrowserWindow, webContents, dialog, shell, app } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs/promises";
import path$1 from "path";
import { createRequire } from "module";
function RegisterIpcEvent(resourcesPath) {
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
  ipcMain.on("webview-id", (_event, id) => {
    const wc = webContents.fromId(id);
    wc == null ? void 0 : wc.setWindowOpenHandler(({ url }) => {
      wc.loadURL(url);
      return { action: "deny" };
    });
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
  ipcMain.handle("svg-to-symbol", async (_event, filePath) => {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
      const innerContent = content.replace(/<svg[^>]*>/, "").replace("</svg>", "").trim();
      const id = "icon-" + path.basename(filePath, ".svg");
      const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 64 64";
      const symbol = `<symbol id="${id}" viewBox="${viewBox}">${innerContent}</symbol>`;
      return { success: true, symbol, id, viewBox };
    } catch (error) {
      console.error("解析 SVG 失败:", error);
      return { success: false, message: String(error) };
    }
  });
  ipcMain.handle("svgs-to-symbol", async (_event, folderPath) => {
    try {
      const absolutePath = path.join(resourcesPath, folderPath);
      const files = await fs.readdir(absolutePath);
      console.log(absolutePath, files);
      const svgFiles = files.filter((file) => file.endsWith(".svg"));
      const symbols = [];
      for (const file of svgFiles) {
        const filePath = path.join(absolutePath, file);
        const content = await fs.readFile(filePath, "utf-8");
        const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
        const innerContent = content.replace(/<svg[^>]*>/, "").replace("</svg>", "").trim();
        const id = "icon-" + path.basename(file, ".svg");
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 64 64";
        const symbol = `<symbol id="${id}" viewBox="${viewBox}">${innerContent}</symbol>`;
        symbols.push(symbol);
      }
      return { success: true, symbols };
    } catch (error) {
      console.error("解析 SVG 文件夹失败:", error);
      return { success: false, message: String(error) };
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
  db.prepare(`
    CREATE TABLE IF NOT EXISTS wallpaper (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      file_path TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      style TEXT,
      create_time INTEGER,
      last_browse_time INTEGER
    )
  `).run();
  db.prepare(`
    CREATE TABLE IF NOT EXISTS icon (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon_type TEXT NOT NULL, 
        icon_name TEXT NOT NULL,         -- 图标名称（如 'pdf', 'folder' 等）
        icon_value TEXT,                 -- 图标内容（SVG源码、URL或路径）
        symbol_id TEXT NOT NULL,         -- 生成的 symbol ID
        level INTEGER DEFAULT 0,       -- 优先级等级，数字越小优先级越高，默认100
        create_time INTEGER,             -- 创建时间
        update_time INTEGER              -- 更新时间
      )
    `).run();
  db.prepare(`
    CREATE TABLE IF NOT EXISTS icon_map (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      extension TEXT NOT NULL UNIQUE,     -- 扩展名，比如 pdf、docx、mp4
      icon_name TEXT NOT NULL          -- 对应图标名，比如：pdf、word、video
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
  ipcMain.handle("saveAsWallpaper", async (_e, file) => {
    if (!db) initDatabase();
    const now = Date.now();
    try {
      const stmt = db.prepare(`
              INSERT INTO wallpaper
                (name, file_size, file_path, type, create_time)
              VALUES (?, ?, ?, ?, ?)
            `);
      const result = stmt.run(
        file.name,
        file.size,
        file.path,
        file.type,
        now
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
    width: 960,
    height: 600,
    minWidth: 720,
    minHeight: 450,
    resizable: true,
    // 从public文件中找静态图片和图标等文件
    icon: path.join(process.env.VITE_PUBLIC, "Icon.ico"),
    frame: false,
    // 预加载文件在运行时的文件夹，实际实在dist-electron中
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
      autoplayPolicy: "no-user-gesture-required"
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
RegisterIpcEvent(process.env.VITE_PUBLIC);
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
