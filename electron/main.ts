import { app, BrowserWindow } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { RegisterIpcEvent } from "./main_modules.ts";
import {initDatabase, RegisterDataBaseOperations} from "./main_database.ts";

// const require = createRequire(import.meta.url)
// 将当前文件的文件URL转换为路径URL，并获取目录部分
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 项目根目录，electron上级
process.env.APP_ROOT = path.join(__dirname, '..')

// Vite服务器地址，开发存在打包后为ud
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
// 导出主进程和预加载文件包（从ts编译为js）
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
// 导入渲染进程的包
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
// 通过三元运算符，来拼凑项目地址或是直接读取dist文件
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

// ts中需要声明加赋值
let win: BrowserWindow | null
// 创建窗口，初始为null，创建时为对象
function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 800,
    // 从public文件中找静态图片和图标等文件
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    frame:false,
    // 预加载文件在运行时的文件夹，实际实在dist-electron中
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })
  // 判断是否为生产环境，如果是生产环境则使用打包后的index.html
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// 注册所有ipcMain.on和ipcMain.handle
RegisterIpcEvent()
RegisterDataBaseOperations()

// darwin是macOS的版本，因为退出逻辑不一致，单独处理
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

// 对macOS中的补正，运行在后台，但是没有窗口是创建一个
app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 异步操作，需要在完成初始化后再创建窗口
app.whenReady().then(createWindow).then(initDatabase)
