import { getDb } from '../db/client.js'
import type { AnalyticsEventRow } from '../types.js'

export function createAnalyticsEvent(row: AnalyticsEventRow): void {
  getDb().prepare(`
    INSERT OR IGNORE INTO analytics_events
      (id, funnel_id, funnel_slug, session_id, event_type, step_index, step_id, occurred_at, metadata_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    row.id, row.funnel_id, row.funnel_slug, row.session_id,
    row.event_type, row.step_index ?? null, row.step_id ?? null,
    row.occurred_at, row.metadata_json
  )
}

export interface AnalyticsSummary {
  totalViews: number
  totalStarts: number
  totalCompletions: number
  completionRate: number
  stepBreakdown: StepBreakdown[]
}

export interface StepBreakdown {
  stepIndex: number
  stepId: string | null
  views: number
  completions: number
  dropOffRate: number
}

export function getAnalyticsSummary(funnelId: string): AnalyticsSummary {
  const db = getDb()

  const count = (eventType: string) =>
    (db.prepare(`
      SELECT COUNT(DISTINCT session_id) as c FROM analytics_events
      WHERE funnel_id = ? AND event_type = ?
    `).get(funnelId, eventType) as any)?.c ?? 0

  const totalViews = count('funnel_view')
  const totalStarts = count('funnel_start')
  const totalCompletions = count('funnel_complete')
  const completionRate = totalViews > 0 ? Math.round((totalCompletions / totalViews) * 100) : 0

  const stepRows = db.prepare(`
    SELECT step_index, step_id,
      COUNT(DISTINCT CASE WHEN event_type = 'step_view' THEN session_id END) as views,
      COUNT(DISTINCT CASE WHEN event_type = 'step_complete' THEN session_id END) as completions
    FROM analytics_events
    WHERE funnel_id = ? AND step_index IS NOT NULL
    GROUP BY step_index, step_id
    ORDER BY step_index ASC
  `).all(funnelId) as any[]

  const stepBreakdown: StepBreakdown[] = stepRows.map(r => ({
    stepIndex: r.step_index,
    stepId: r.step_id,
    views: r.views,
    completions: r.completions,
    dropOffRate: r.views > 0 ? Math.round(((r.views - r.completions) / r.views) * 100) : 0,
  }))

  return { totalViews, totalStarts, totalCompletions, completionRate, stepBreakdown }
}
