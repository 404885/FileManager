// import Database from "better-sqlite3";
// import path from 'path';
// import { ipcMain, app } from "electron";





// 插入数据
export function RegisterDatabase() {
    const Database = require("better-sqlite3");
    const path = require("path");
    const { ipcMain, app } = require("electron");

  ipcMain.on('prepare', () => {
      console.log("Prepare");
      const dbPath = path.join(app.getPath('home'), 'test.db');
      const db = new Database(dbPath);
      console.log(db);
      db.prepare(`
          CREATE TABLE IF NOT EXISTS workspace (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              file_count INTEGER DEFAULT 0,
              create_time TEXT DEFAULT (datetime('now', 'localtime')),
              ast_browse_time TEXT
          )
      `).run();
      console.log("connect to database");
  });
}


