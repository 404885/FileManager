import {ipcRenderer, contextBridge} from 'electron'
import {FileNode, WallPaper} from "@/utils/type.ts";



contextBridge.exposeInMainWorld("electronAPI", {
  // 这种方式能只暴露指定的api方法
  // 从渲染进程中接受参数，通过通道传递至主进程的处理器（ipcMain.handle）中进行处理
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  openDirectoryDialog: () => ipcRenderer.invoke('open-directory-dialog'),
  openFile: (filePath: string) => ipcRenderer.invoke('open-file', filePath),
  svgTransform: (filePath: string) => ipcRenderer.invoke('svg-to-symbol', filePath),
  svgsTransform: (folderPath: string) => ipcRenderer.invoke('svgs-to-symbol', folderPath),

  windowControls: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    pinned: (isPinned: boolean) => ipcRenderer.send('window-pinned', isPinned),
    getWebViewId: (id:number) => ipcRenderer.send('webview-id', id),
  },
  dataOperation: {
    queryAll: (sql: string, params: any[] = []) =>
        ipcRenderer.invoke('queryAll', sql, params),
    queryOne: (sql: string, params: any[] = []) =>
        ipcRenderer.invoke('queryOne', sql, params),
    execute: (sql: string, params: any[] = []) =>
        ipcRenderer.invoke('execute', sql, params),
    saveFileToDb: (file:FileNode,workspace:number) =>
        ipcRenderer.invoke('saveFileToDb', file, workspace),
    saveDirectoryToDb: (directory:FileNode,workspace:number) =>
        ipcRenderer.invoke('saveDirectoryToDb', directory, workspace),
    loadTree: (workspace:number,keyword?:string) => ipcRenderer.invoke('loadTree',workspace,keyword),
    loadTable: (workspace:number,associatedFolder:number | null = null) => ipcRenderer.invoke('loadTable',workspace,associatedFolder),
    loadTableV2: (workspace:number) => ipcRenderer.invoke('loadTableV2',workspace),
    saveAsWallpaper: (file: WallPaper) => ipcRenderer.invoke('saveAsWallpaper',file),
  }
})