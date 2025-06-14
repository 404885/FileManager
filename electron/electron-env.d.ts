/// <reference types="vite-plugin-electron/electron-env" />


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

interface FileNode {
  name: string
  path: string
  size?: number
  birthtime?: Date
  atime?: Date
  mtime?: Date
  children?: FileNode[] // 递归类型，表示目录结构
}

interface ElTreeNode {
  id: number;
  label: string;
  children?: ElTreeNode[];
  isLeaf?: boolean;
  // 可按需加其他字段，如 fullPath、size 等
  fullPath?: string;
  size?: number;
}
// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import('electron').IpcRenderer,
  electronAPI: {
    openFileDialog: () => Promise<
        | { canceled: true }
        | {
      canceled: false
      filePath: string
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
    },
    dataOperation: {
      queryOne: (sql: string, params?: any[]) => Promise<any>,
      queryAll: (sql: string, params?: any[]) => Promise<any[]>,
      execute: (sql: string, params?: any[]) => Promise<{ changes: number, lastInsertRowid: number }>,
      saveDirectoryToDb: (tree: FileNode) => Promise<{ success: boolean }>,
      loadTree: () => Promise<ElTreeNode[]>,
    }
  }
}
