import type { FastifyInstance } from 'fastify'
import { nanoid } from 'nanoid'
import * as funnelService from '../services/funnelService.js'
import * as analyticsService from '../services/analyticsService.js'
import type { AnalyticsEventPayload } from '../types.js'

export async function analyticsRoutes(app: FastifyInstance) {
  // Public: record an analytics event
  app.post<{ Body: AnalyticsEventPayload }>(
    '/api/analytics',
    async (req, reply) => {
      const body = req.body
      if (!body.funnelId || !body.eventType) {
        return reply.status(400).send({ error: 'funnelId and eventType required' })
      }
      analyticsService.createAnalyticsEvent({
        id: nanoid(),
        funnel_id: body.funnelId,
        funnel_slug: body.funnelSlug ?? '',
        session_id: body.sessionId ?? nanoid(),
        event_type: body.eventType,
        step_index: body.stepIndex ?? null,
        step_id: body.stepId ?? null,
        occurred_at: body.occurredAt ?? new Date().toISOString(),
        metadata_json: JSON.stringify(body.metadata ?? {}),
      })
      return reply.status(201).send({ ok: true })
    }
  )

  // Get analytics summary for a funnel
  app.get<{ Params: { id: string } }>(
    '/api/funnels/:id/analytics',
    async (req, reply) => {
      const existing = funnelService.getFunnelById(req.params.id)
      if (!existing) return reply.status(404).send({ error: 'Not found' })
      return analyticsService.getAnalyticsSummary(req.params.id)
    }
  )
}
