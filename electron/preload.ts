import { ipcRenderer, contextBridge } from 'electron'

interface FileNode {
  name: string
  path: string
  size?: number
  birthtime?: Date
  atime?: Date
  mtime?: Date
  children?: FileNode[] // 递归类型，表示目录结构
}


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
  dataOperation: {
    queryAll: (sql: string, params: any[] = []) =>
        ipcRenderer.invoke('queryAll', sql, params),
    queryOne: (sql: string, params: any[] = []) =>
        ipcRenderer.invoke('queryOne', sql, params),
    execute: (sql: string, params: any[] = []) =>
        ipcRenderer.invoke('execute', sql, params),
    saveDirectoryToDb: (tree:FileNode) =>
        ipcRenderer.invoke('saveDirectoryToDb', tree),
    saveProgress: (callback:any)=>
        ipcRenderer.on('saveDirectoryToDb-progress',callback),
    loadTree: () => ipcRenderer.invoke('load-tree'),
  }
})