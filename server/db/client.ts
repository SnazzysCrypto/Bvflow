import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import { getConfig } from '../config.js'

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db

  const config = getConfig()
  const dbDir = path.dirname(config.dbPath)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  _db = new Database(config.dbPath)
  _db.pragma('journal_mode = WAL')
  _db.pragma('foreign_keys = ON')
  return _db
}
