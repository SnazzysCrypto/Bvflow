import type { FastifyInstance } from 'fastify'
import { nanoid } from 'nanoid'
import * as funnelService from '../services/funnelService.js'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'funnel'
}

function uniqueSlug(base: string, excludeId?: string): string {
  let slug = slugify(base)
  let attempt = slug
  let i = 2
  while (funnelService.slugExists(attempt, excludeId)) {
    attempt = `${slug}-${i++}`
  }
  return attempt
}

export async function funnelRoutes(app: FastifyInstance) {
  // List all funnels
  app.get('/api/funnels', async (_req, reply) => {
    const rows = funnelService.listFunnels()
    return rows.map(r => ({
      ...JSON.parse(r.funnel_json),
      steps: undefined, // omit steps from list view for perf
    }))
  })

  // Get single funnel (full, with steps)
  app.get<{ Params: { id: string } }>('/api/funnels/:id', async (req, reply) => {
    const row = funnelService.getFunnelById(req.params.id)
    if (!row) return reply.status(404).send({ error: 'Not found' })
    return JSON.parse(row.funnel_json)
  })

  // Create funnel
  app.post<{ Body: any }>('/api/funnels', async (req, reply) => {
    const body = req.body as any
    const id = nanoid()
    const now = new Date().toISOString()
    const slug = uniqueSlug(body.title ?? 'new-funnel')

    const funnel = {
      ...body,
      id,
      slug,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    }

    const row = funnelService.createFunnel({
      id,
      slug,
      title: funnel.title,
      description: funnel.description ?? '',
      status: 'draft',
      funnel_json: JSON.stringify(funnel),
      created_at: now,
      updated_at: now,
      published_at: null,
    })

    return reply.status(201).send(JSON.parse(row.funnel_json))
  })

  // Update funnel (full replace)
  app.put<{ Params: { id: string }; Body: any }>('/api/funnels/:id', async (req, reply) => {
    const existing = funnelService.getFunnelById(req.params.id)
    if (!existing) return reply.status(404).send({ error: 'Not found' })

    const body = req.body as any
    const now = new Date().toISOString()

    // Handle slug uniqueness if title changed
    let slug = body.slug ?? existing.slug
    if (slug !== existing.slug && funnelService.slugExists(slug, req.params.id)) {
      slug = uniqueSlug(slug, req.params.id)
    }

    const updated = { ...body, id: req.params.id, slug, updatedAt: now }
    const row = funnelService.updateFunnel(req.params.id, {
      slug,
      title: updated.title,
      description: updated.description ?? '',
      status: updated.status ?? existing.status,
      funnel_json: JSON.stringify(updated),
      published_at: updated.publishedAt ?? existing.published_at,
    })

    return JSON.parse(row!.funnel_json)
  })

  // Delete funnel
  app.delete<{ Params: { id: string } }>('/api/funnels/:id', async (req, reply) => {
    const deleted = funnelService.deleteFunnel(req.params.id)
    if (!deleted) return reply.status(404).send({ error: 'Not found' })
    return reply.status(204).send()
  })

  // Duplicate funnel
  app.post<{ Params: { id: string } }>('/api/funnels/:id/duplicate', async (req, reply) => {
    const existing = funnelService.getFunnelById(req.params.id)
    if (!existing) return reply.status(404).send({ error: 'Not found' })

    const original = JSON.parse(existing.funnel_json)
    const now = new Date().toISOString()
    const id = nanoid()
    const newTitle = `${original.title} (copy)`
    const slug = uniqueSlug(newTitle)

    const funnel = {
      ...original,
      id,
      slug,
      title: newTitle,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      publishedAt: null,
    }

    const row = funnelService.createFunnel({
      id,
      slug,
      title: funnel.title,
      description: funnel.description ?? '',
      status: 'draft',
      funnel_json: JSON.stringify(funnel),
      created_at: now,
      updated_at: now,
      published_at: null,
    })

    return reply.status(201).send(JSON.parse(row.funnel_json))
  })

  // Publish funnel
  app.post<{ Params: { id: string } }>('/api/funnels/:id/publish', async (req, reply) => {
    const existing = funnelService.getFunnelById(req.params.id)
    if (!existing) return reply.status(404).send({ error: 'Not found' })

    const now = new Date().toISOString()
    const funnel = { ...JSON.parse(existing.funnel_json), status: 'published', publishedAt: now }
    const row = funnelService.updateFunnel(req.params.id, {
      status: 'published',
      funnel_json: JSON.stringify(funnel),
      published_at: now,
    })
    return JSON.parse(row!.funnel_json)
  })

  // Unpublish funnel
  app.post<{ Params: { id: string } }>('/api/funnels/:id/unpublish', async (req, reply) => {
    const existing = funnelService.getFunnelById(req.params.id)
    if (!existing) return reply.status(404).send({ error: 'Not found' })

    const funnel = { ...JSON.parse(existing.funnel_json), status: 'draft' }
    const row = funnelService.updateFunnel(req.params.id, {
      status: 'draft',
      funnel_json: JSON.stringify(funnel),
    })
    return JSON.parse(row!.funnel_json)
  })
}
