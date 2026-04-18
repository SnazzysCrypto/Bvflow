import type { FastifyInstance } from 'fastify'
import { STARTER_TEMPLATES } from '../data/templates.js'

export async function templateRoutes(app: FastifyInstance) {
  app.get('/api/templates', async () => {
    return STARTER_TEMPLATES
  })
}
