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
      files: {
        name: string
        path: string
        size: number
        birthtime: Date
        atime: Date
        mtime: Date
      }[]
    }
    >
    windowControls: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      pinned: (isPinned: boolean) => void;
    },
  }
}
