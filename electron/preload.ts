import { ipcRenderer, contextBridge } from 'electron'

// 通过该函数暴露window.ipcRenderer给渲染进程，其中含有四个方法
// contextBridge.exposeInMainWorld('ipcRenderer', {
//   on(...args: Parameters<typeof ipcRenderer.on>) {
//     const [channel, listener] = args
//     return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
//   },
//   off(...args: Parameters<typeof ipcRenderer.off>) {
//     const [channel, ...omit] = args
//     return ipcRenderer.off(channel, ...omit)
//   },
//   send(...args: Parameters<typeof ipcRenderer.send>) {
//     const [channel, ...omit] = args
//     return ipcRenderer.send(channel, ...omit)
//   },
//   invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
//     const [channel, ...omit] = args
//     return ipcRenderer.invoke(channel, ...omit)
//   },
//   // You can expose other APTs you need here.
//   // ...
// })

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
})