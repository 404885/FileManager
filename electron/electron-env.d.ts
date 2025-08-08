import {ElTreeNode, FileNode, VXETableNode, WallPaper} from "@/utils/type.ts";

export {};

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string
    /** /dist/ or /public/ */
    VITE_PUBLIC: string
  }
}

// Used in Renderer process, expose in `preload.ts`
declare global{
  interface Window {
    ipcRenderer: import('electron').IpcRenderer,
    electronAPI: {
      openFile: (filePath: string) => Promise<string>
      openFileDialog: () => Promise<
          | { canceled: true }
          | {
        canceled: false
        name:string
        path: string
        content: string
        stats: import('fs').Stats
      }
      >
      openDirectoryDialog: () => Promise<
          | { canceled: true }
          | {
        canceled: false
        directory: string
        files: FileNode
      }
      >
      windowControls: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
        pinned: (isPinned: boolean) => void;
        getWebViewId:(id:number) => void;
      },
      dataOperation: {
        queryOne: (sql: string, params?: any[]) => Promise<any>,
        queryAll: (sql: string, params?: any[]) => Promise<any[]>,
        execute: (sql: string, params?: any[]) => Promise<{ changes: number, lastInsertRowid: number }>,
        saveFileToDb: (file: FileNode, workspace: number) => Promise<{ success: boolean,lastInsertRowid?: number,reason?: string,error?: any}>,
        saveDirectoryToDb: (directory: FileNode, workspace: number) => Promise<{ success: boolean }>,
        loadTree: (workspace: number,keyword?: string) => Promise<ElTreeNode[]>,
        loadTable: (workspace: number,associatedFolder:number | null = null) => Promise<VXETableNode[]>,
        loadTableV2: (workspace: number) => Promise<VXETableNode[]>,
        saveAsWallpaper: (file: WallPaper) => Promise<{ success: boolean,lastInsertRowid?: number,reason?: string,error?: any}>,
      }
    }
  }
}
