import {BrowserWindow, dialog, ipcMain, shell,webContents} from 'electron';
import fs from "fs/promises";
import path from "node:path";




export function RegisterIpcEvent(resourcesPath: string) {
    ipcMain.on('window-minimize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win?.minimize();
    });
    ipcMain.on('window-maximize', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win?.isMaximized() ? win?.unmaximize() : win?.maximize();
    });
    ipcMain.on('window-close', (event) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win?.close();
    });
    ipcMain.on("window-pinned", (event, isPinned: boolean) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win?.setAlwaysOnTop(isPinned);
    })

    ipcMain.on('webview-id', (_event, id:number) => {
        const wc = webContents.fromId(id)
        // 拦截 new-window 事件
        wc?.setWindowOpenHandler(({ url }) => {
            wc.loadURL(url) // 当前 webview 内打开
            return { action: 'deny' }
        })
    })

    ipcMain.handle('open-file-dialog', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'All Files', extensions: ['*'] }]
        })
        if (canceled || filePaths.length === 0) return { canceled: true }

        const filePath = filePaths[0]
        const content = await fs.readFile(filePath, 'utf-8')
        const stats = await fs.stat(filePath)

        const fileName = path.basename(filePath)
        return { canceled: false, name:fileName ,path:filePath, content:content, stats:stats }
    })
    ipcMain.handle('open-directory-dialog', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory']
        })

        if (canceled || filePaths.length === 0) {
            return { canceled: true }
        }

        const directory = filePaths[0]

        async function walk(dir: string): Promise<any> {
            const list = await fs.readdir(dir, { withFileTypes: true })
            const children = []

            for (const entry of list) {
                const fullPath = path.join(dir, entry.name)
                const s = await fs.stat(fullPath)

                if (entry.isDirectory()) {
                    const subDir = await walk(fullPath)
                    children.push({
                        name: entry.name,
                        path: fullPath,
                        birthtime: s.birthtime,
                        atime: s.atime,
                        mtime: s.mtime,
                        children: subDir
                    })
                } else if (entry.isFile()) {
                    children.push({
                        name: entry.name,
                        path: fullPath,
                        size: s.size,
                        birthtime: s.birthtime,
                        atime: s.atime,
                        mtime: s.mtime
                    })
                }
            }

            return children
        }

        const tree = {
            name: path.basename(directory),
            path: directory,
            children: await walk(directory)
        }

        return {
            canceled: false,
            files: tree
        }
    })
    ipcMain.handle('close-directory-dialog', async () => {})
    ipcMain.handle('open-file', async (_event, filePath) => {
        try {
            return await shell.openPath(filePath) // 空字符串表示成功
        } catch (err) {
            console.error('打开文件失败:', err)
            return 'error'
        }
    })


    // 异步写法
    ipcMain.handle('svg-to-symbol', async (_event, filePath: string) => {
        try {
            const content = await fs.readFile(filePath, 'utf-8')

            const viewBoxMatch = content.match(/viewBox="([^"]+)"/)
            const innerContent = content
                .replace(/<svg[^>]*>/, '')
                .replace('</svg>', '')
                .trim()

            const id = 'icon-' + path.basename(filePath, '.svg')
            const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 64 64'

            const symbol = `<symbol id="${id}" viewBox="${viewBox}">${innerContent}</symbol>`

            return { success: true, symbol, id, viewBox }
        } catch (error) {
            console.error('解析 SVG 失败:', error)
            return { success: false, message: String(error) }
        }
    })

    ipcMain.handle('svgs-to-symbol', async (_event, folderPath: string) => {
        try {

            const absolutePath = path.join(resourcesPath, folderPath);

            const files = await fs.readdir(absolutePath)
            console.log(absolutePath, files)

            const svgFiles = files.filter(file => file.endsWith('.svg'));  // 只筛选 SVG 文件


            const symbols: string[] = [];  // 用于存放所有 <symbol> 标签

            for (const file of svgFiles) {
                const filePath = path.join(absolutePath, file);  // 获取文件的完整路径
                const content = await fs.readFile(filePath, 'utf-8');  // 读取文件内容

                // 提取 viewBox 和内部的 SVG 内容
                const viewBoxMatch = content.match(/viewBox="([^"]+)"/);
                const innerContent = content
                    .replace(/<svg[^>]*>/, '')  // 去除 <svg> 标签
                    .replace('</svg>', '')  // 去除 </svg> 标签
                    .trim();  // 清除前后空格

                const id = 'icon-' + path.basename(file, '.svg');  // 生成 id
                const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 64 64';  // 如果没有 viewBox，使用默认值

                // 生成 symbol 标签并添加到 symbols 数组
                const symbol = `<symbol id="${id}" viewBox="${viewBox}">${innerContent}</symbol>`;
                symbols.push(symbol);
            }
            return { success: true, symbols };  // 返回生成的 sprite.svg 内容
        }
        catch (error) {
            console.error('解析 SVG 文件夹失败:', error);
            return { success: false, message: String(error) };
        }



    })



}