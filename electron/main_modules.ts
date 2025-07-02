import {BrowserWindow, dialog, ipcMain, shell} from 'electron';
import fs from "fs/promises";
import path from "node:path";


export function RegisterIpcEvent() {
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

}