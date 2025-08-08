"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // 这种方式能只暴露指定的api方法
  // 从渲染进程中接受参数，通过通道传递至主进程的处理器（ipcMain.handle）中进行处理
  openFileDialog: () => electron.ipcRenderer.invoke("open-file-dialog"),
  openDirectoryDialog: () => electron.ipcRenderer.invoke("open-directory-dialog"),
  openFile: (filePath) => electron.ipcRenderer.invoke("open-file", filePath),
  windowControls: {
    minimize: () => electron.ipcRenderer.send("window-minimize"),
    maximize: () => electron.ipcRenderer.send("window-maximize"),
    close: () => electron.ipcRenderer.send("window-close"),
    pinned: (isPinned) => electron.ipcRenderer.send("window-pinned", isPinned),
    getWebViewId: (id) => electron.ipcRenderer.send("webview-id", id)
  },
  dataOperation: {
    queryAll: (sql, params = []) => electron.ipcRenderer.invoke("queryAll", sql, params),
    queryOne: (sql, params = []) => electron.ipcRenderer.invoke("queryOne", sql, params),
    execute: (sql, params = []) => electron.ipcRenderer.invoke("execute", sql, params),
    saveFileToDb: (file, workspace) => electron.ipcRenderer.invoke("saveFileToDb", file, workspace),
    saveDirectoryToDb: (directory, workspace) => electron.ipcRenderer.invoke("saveDirectoryToDb", directory, workspace),
    loadTree: (workspace, keyword) => electron.ipcRenderer.invoke("loadTree", workspace, keyword),
    loadTable: (workspace, associatedFolder = null) => electron.ipcRenderer.invoke("loadTable", workspace, associatedFolder),
    loadTableV2: (workspace) => electron.ipcRenderer.invoke("loadTableV2", workspace),
    saveAsWallpaper: (file) => electron.ipcRenderer.invoke("saveAsWallpaper", file)
  }
});
