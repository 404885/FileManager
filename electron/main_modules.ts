import {ipcMain, BrowserWindow, dialog} from 'electron';
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
        return { canceled: false, filePath, content, stats }
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

                if (entry.isDirectory()) {
                    const subDir = await walk(fullPath)
                    children.push({
                        name: entry.name,
                        path: fullPath,
                        children: subDir
                    })
                } else if (entry.isFile()) {
                    const s = await fs.stat(fullPath)
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
            directory,
            files: tree
        }
    })

}