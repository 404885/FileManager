import {ipcMain, BrowserWindow, dialog} from 'electron';
import fs from "fs/promises";

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
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'Text Files', extensions: ['txt', 'md'] },
                { name: 'All Files', extensions: ['*'] }
            ]
        })
        if (result.canceled || result.filePaths.length === 0) {
            return { canceled: true }
        }
        const filePath = result.filePaths[0]
        const content = await fs.readFile(filePath, 'utf-8')
        // console.log(filePath, content)
        return { canceled: false, filePath, content }
    })


}