import { ipcRenderer, contextBridge } from 'electron'


contextBridge.exposeInMainWorld("electronAPI", {
  // 这种方式能只暴露指定的api方法
  // 从渲染进程中接受参数，通过通道传递至主进程的处理器（ipcMain.handle）中进行处理
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  openDirectoryDialog: () => ipcRenderer.invoke('open-directory-dialog'),
  windowControls: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    pinned: (isPinned: boolean) => ipcRenderer.send('window-pinned', isPinned),
  },
  dataOperation:{
    prepare: () => ipcRenderer.send('prepare'),
  }
})