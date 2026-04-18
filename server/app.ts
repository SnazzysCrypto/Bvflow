import Fastify from 'fastify'
import cors from '@fastify/cors'
import staticFiles from '@fastify/static'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { getConfig } from './config.js'
import { funnelRoutes } from './routes/funnels.js'
import { submissionRoutes } from './routes/submissions.js'
import { analyticsRoutes } from './routes/analytics.js'
import { exportRoutes } from './routes/export.js'
import { templateRoutes } from './routes/templates.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function createApp() {
  const config = getConfig()
  const app = Fastify({ logger: false })

  await app.register(cors, {
    origin: config.nodeEnv === 'production'
      ? config.clientOrigin
      : true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  // Public submit & analytics endpoints must allow any origin (published HTML)
  app.addHook('onRequest', async (req, reply) => {
    const path2 = req.routerPath || req.url
    if (path2?.startsWith('/api/submit/') || path2 === '/api/analytics') {
      reply.header('Access-Control-Allow-Origin', '*')
    }
  })

  await app.register(funnelRoutes)
  await app.register(submissionRoutes)
  await app.register(analyticsRoutes)
  await app.register(exportRoutes)
  await app.register(templateRoutes)

  // Serve built client in production
  const clientDist = path.resolve(__dirname, '../dist/client')
  if (config.nodeEnv === 'production' && fs.existsSync(clientDist)) {
    await app.register(staticFiles, { root: clientDist, prefix: '/' })
    app.setNotFoundHandler((_req, reply) => {
      reply.sendFile('index.html')
    })
  }

  return app
}
