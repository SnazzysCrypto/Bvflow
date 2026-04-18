import type { FastifyInstance } from 'fastify'
import { nanoid } from 'nanoid'
import * as funnelService from '../services/funnelService.js'
import * as submissionService from '../services/submissionService.js'
import type { SubmitPayload } from '../types.js'

export async function submissionRoutes(app: FastifyInstance) {
  // Public: submit a funnel response
  app.post<{ Params: { slug: string }; Body: SubmitPayload }>(
    '/api/submit/:slug',
    async (req, reply) => {
      const funnel = funnelService.getFunnelBySlug(req.params.slug)
      if (!funnel) return reply.status(404).send({ error: 'Funnel not found' })

      const body = req.body
      const id = nanoid()
      const row = submissionService.createSubmission({
        id,
        funnel_id: funnel.id,
        funnel_slug: funnel.slug,
        started_at: body.startedAt ?? new Date().toISOString(),
        completed_at: body.completedAt ?? (body.isComplete ? new Date().toISOString() : null),
        data_json: JSON.stringify(body.data ?? {}),
        last_step: body.lastStep ?? 0,
        total_steps: body.totalSteps ?? 1,
        is_complete: body.isComplete ? 1 : 0,
        metadata_json: JSON.stringify(body.metadata ?? {}),
        status: 'new',
      })

      return reply.status(201).send({ submissionId: row.id })
    }
  )

  // List submissions for a funnel
  app.get<{ Params: { id: string }; Querystring: { limit?: string; offset?: string } }>(
    '/api/funnels/:id/submissions',
    async (req, reply) => {
      const existing = funnelService.getFunnelById(req.params.id)
      if (!existing) return reply.status(404).send({ error: 'Not found' })

      const limit = parseInt(req.query.limit ?? '100', 10)
      const offset = parseInt(req.query.offset ?? '0', 10)
      const rows = submissionService.listSubmissions(req.params.id, limit, offset)
      const total = submissionService.countSubmissions(req.params.id)

      return {
        total,
        submissions: rows.map(r => ({
          id: r.id,
          funnelId: r.funnel_id,
          funnelSlug: r.funnel_slug,
          startedAt: r.started_at,
          completedAt: r.completed_at,
          data: JSON.parse(r.data_json),
          lastStep: r.last_step,
          totalSteps: r.total_steps,
          isComplete: r.is_complete === 1,
          metadata: JSON.parse(r.metadata_json),
          status: r.status,
        })),
      }
    }
  )

  // CSV export
  app.get<{ Params: { id: string } }>(
    '/api/funnels/:id/submissions/csv',
    async (req, reply) => {
      const existing = funnelService.getFunnelById(req.params.id)
      if (!existing) return reply.status(404).send({ error: 'Not found' })

      const csv = submissionService.submissionsToCsv(req.params.id)
      reply.header('Content-Type', 'text/csv')
      reply.header('Content-Disposition', `attachment; filename="${existing.slug}-submissions.csv"`)
      return reply.send(csv)
    }
  )

  // Update submission status
  app.patch<{ Params: { id: string; submissionId: string }; Body: { status: string } }>(
    '/api/funnels/:id/submissions/:submissionId',
    async (req, reply) => {
      const ok = submissionService.updateSubmissionStatus(req.params.submissionId, req.body.status)
      if (!ok) return reply.status(404).send({ error: 'Not found' })
      return reply.status(200).send({ ok: true })
    }
  )

  // Delete submission
  app.delete<{ Params: { id: string; submissionId: string } }>(
    '/api/funnels/:id/submissions/:submissionId',
    async (req, reply) => {
      const ok = submissionService.deleteSubmission(req.params.submissionId)
      if (!ok) return reply.status(404).send({ error: 'Not found' })
      return reply.status(204).send()
    }
  )
}
