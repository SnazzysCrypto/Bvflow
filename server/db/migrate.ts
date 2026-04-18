import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDb } from './client.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function runMigrations() {
  const db = getDb()
  const migrationsDir = path.join(__dirname, 'migrations')
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort()

  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      name TEXT PRIMARY KEY,
      ran_at TEXT NOT NULL
    )
  `)

  const ran = new Set(
    db.prepare('SELECT name FROM _migrations').all().map((r: any) => r.name)
  )

  for (const file of files) {
    if (ran.has(file)) continue
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    db.exec(sql)
    db.prepare('INSERT INTO _migrations (name, ran_at) VALUES (?, ?)').run(file, new Date().toISOString())
    console.log(`[db] Ran migration: ${file}`)
  }
}
