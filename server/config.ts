import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface Config {
  port: number
  dbPath: string
  clientOrigin: string
  nodeEnv: string
  exportsDir: string
}

let _config: Config | null = null

export function getConfig(): Config {
  if (_config) return _config

  _config = {
    port: parseInt(process.env.PORT ?? '3001', 10),
    dbPath: process.env.DB_PATH ?? path.resolve(__dirname, '../data/funnels.db'),
    clientOrigin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
    nodeEnv: process.env.NODE_ENV ?? 'development',
    exportsDir: path.resolve(__dirname, '../exports'),
  }

  return _config
}
