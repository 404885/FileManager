import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export function initDatabase()  {
    const Database = require('better-sqlite3');
    const dbPath = path.join(process.cwd(), 'FileManager.db');
    console.log('数据库将创建在：', dbPath);

    const db = new Database(dbPath);
    db.prepare(`
    CREATE TABLE IF NOT EXISTS workspace (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      file_count INTEGER DEFAULT 0,
      create_time INTEGER,
      browse_time INTEGER
    )
  `).run();

    return db;
}

export function RegisterDatabase(){

}