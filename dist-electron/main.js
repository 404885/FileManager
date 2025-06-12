"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const node_url = require("node:url");
const path = require("node:path");
const fs = require("fs/promises");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
function RegisterIpcEvent() {
  electron.ipcMain.on("window-minimize", (event) => {
    const win2 = electron.BrowserWindow.fromWebContents(event.sender);
    win2 == null ? void 0 : win2.minimize();
  });
  electron.ipcMain.on("window-maximize", (event) => {
    const win2 = electron.BrowserWindow.fromWebContents(event.sender);
    (win2 == null ? void 0 : win2.isMaximized()) ? win2 == null ? void 0 : win2.unmaximize() : win2 == null ? void 0 : win2.maximize();
  });
  electron.ipcMain.on("window-close", (event) => {
    const win2 = electron.BrowserWindow.fromWebContents(event.sender);
    win2 == null ? void 0 : win2.close();
  });
  electron.ipcMain.on("window-pinned", (event, isPinned) => {
    const win2 = electron.BrowserWindow.fromWebContents(event.sender);
    win2 == null ? void 0 : win2.setAlwaysOnTop(isPinned);
  });
  electron.ipcMain.handle("open-file-dialog", async () => {
    const { canceled, filePaths } = await electron.dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "All Files", extensions: ["*"] }]
    });
    if (canceled || filePaths.length === 0) return { canceled: true };
    const filePath = filePaths[0];
    const content = await fs.readFile(filePath, "utf-8");
    const stats = await fs.stat(filePath);
    return { canceled: false, filePath, content, stats };
  });
  electron.ipcMain.handle("open-directory-dialog", async () => {
    const { canceled, filePaths } = await electron.dialog.showOpenDialog({
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
        if (entry.isDirectory()) {
          const subDir = await walk(fullPath);
          children.push({
            name: entry.name,
            path: fullPath,
            children: subDir
          });
        } else if (entry.isFile()) {
          const s = await fs.stat(fullPath);
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
      directory,
      files: tree
    };
  });
}
function RegisterDatabase() {
  const Database = require("better-sqlite3");
  const path2 = require("path");
  const { ipcMain, app } = require("electron");
  ipcMain.on("prepare", () => {
    console.log("Prepare");
    const dbPath = path2.join(app.getPath("home"), "test.db");
    const db = new Database(dbPath);
    console.log(db);
    db.prepare(`
          CREATE TABLE IF NOT EXISTS workspace (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              file_count INTEGER DEFAULT 0,
              create_time TEXT DEFAULT (datetime('now', 'localtime')),
              ast_browse_time TEXT
          )
      `).run();
    console.log("connect to database");
  });
}
const __dirname$1 = path.dirname(node_url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new electron.BrowserWindow({
    width: 1280,
    height: 800,
    // 从public文件中找静态图片和图标等文件
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    frame: false,
    // 预加载文件在运行时的文件夹，实际实在dist-electron中
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs"),
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
RegisterDatabase();
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.whenReady().then(createWindow);
exports.MAIN_DIST = MAIN_DIST;
exports.RENDERER_DIST = RENDERER_DIST;
exports.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;
