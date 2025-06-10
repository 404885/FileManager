import { ipcMain, BrowserWindow, dialog, app } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "fs/promises";
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
    return { canceled: false, filePath, content, stats };
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
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
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
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
