import type { FastifyInstance } from 'fastify'
import path from 'path'
import fs from 'fs'
import * as funnelService from '../services/funnelService.js'
import { buildExportHtml } from '../services/exportService.js'
import { getConfig } from '../config.js'

export async function exportRoutes(app: FastifyInstance) {
  // Download exported HTML for a funnel
  app.get<{ Params: { id: string } }>(
    '/api/funnels/:id/export',
    async (req, reply) => {
      const row = funnelService.getFunnelById(req.params.id)
      if (!row) return reply.status(404).send({ error: 'Not found' })

      const funnel = JSON.parse(row.funnel_json)
      const config = getConfig()
      const html = buildExportHtml(funnel, `http://localhost:${config.port}`)

      reply.header('Content-Type', 'text/html; charset=utf-8')
      reply.header('Content-Disposition', `attachment; filename="${funnel.slug}.html"`)
      return reply.send(html)
    }
  )

  // Save exported HTML to /exports folder and mark published
  app.post<{ Params: { id: string } }>(
    '/api/funnels/:id/export-to-disk',
    async (req, reply) => {
      const row = funnelService.getFunnelById(req.params.id)
      if (!row) return reply.status(404).send({ error: 'Not found' })

      const funnel = JSON.parse(row.funnel_json)
      const config = getConfig()
      const html = buildExportHtml(funnel, `http://localhost:${config.port}`)

      if (!fs.existsSync(config.exportsDir)) {
        fs.mkdirSync(config.exportsDir, { recursive: true })
      }

      const outPath = path.join(config.exportsDir, `${funnel.slug}.html`)
      fs.writeFileSync(outPath, html, 'utf8')

      return reply.send({ path: outPath, slug: funnel.slug })
    }
  )
}
