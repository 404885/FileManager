"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  // 这种方式能只暴露指定的api方法
  // 从渲染进程中接受参数，通过通道传递至主进程的处理器（ipcMain.handle）中进行处理
  openFileDialog: () => electron.ipcRenderer.invoke("open-file-dialog"),
  openDirectoryDialog: () => electron.ipcRenderer.invoke("open-directory-dialog"),
  windowControls: {
    minimize: () => electron.ipcRenderer.send("window-minimize"),
    maximize: () => electron.ipcRenderer.send("window-maximize"),
    close: () => electron.ipcRenderer.send("window-close"),
    pinned: (isPinned) => electron.ipcRenderer.send("window-pinned", isPinned)
  }
});
