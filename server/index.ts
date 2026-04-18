import 'dotenv/config'
import { getConfig } from './config.js'
import { runMigrations } from './db/migrate.js'
import { createApp } from './app.js'

async function main() {
  runMigrations()
  const config = getConfig()
  const app = await createApp()
  await app.listen({ port: config.port, host: '0.0.0.0' })
  console.log(`[server] Running at http://localhost:${config.port}`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
