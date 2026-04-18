import { getDb } from '../db/client.js'
import type { SubmissionRow } from '../types.js'

export function listSubmissions(funnelId: string, limit = 100, offset = 0): SubmissionRow[] {
  return getDb()
    .prepare('SELECT * FROM submissions WHERE funnel_id = ? ORDER BY started_at DESC LIMIT ? OFFSET ?')
    .all(funnelId, limit, offset) as SubmissionRow[]
}

export function getSubmission(id: string): SubmissionRow | null {
  return (getDb().prepare('SELECT * FROM submissions WHERE id = ?').get(id) as SubmissionRow) ?? null
}

export function createSubmission(row: SubmissionRow): SubmissionRow {
  getDb().prepare(`
    INSERT INTO submissions
      (id, funnel_id, funnel_slug, started_at, completed_at, data_json, last_step, total_steps, is_complete, metadata_json, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    row.id, row.funnel_id, row.funnel_slug, row.started_at, row.completed_at ?? null,
    row.data_json, row.last_step, row.total_steps,
    row.is_complete ? 1 : 0, row.metadata_json, row.status
  )
  return getSubmission(row.id)!
}

export function updateSubmissionStatus(id: string, status: string): boolean {
  const result = getDb().prepare('UPDATE submissions SET status = ? WHERE id = ?').run(status, id)
  return result.changes > 0
}

export function deleteSubmission(id: string): boolean {
  const result = getDb().prepare('DELETE FROM submissions WHERE id = ?').run(id)
  return result.changes > 0
}

export function countSubmissions(funnelId: string): number {
  const row = getDb().prepare('SELECT COUNT(*) as count FROM submissions WHERE funnel_id = ?').get(funnelId) as any
  return row?.count ?? 0
}

export function submissionsToCsv(funnelId: string): string {
  const rows = listSubmissions(funnelId, 10000, 0)
  if (rows.length === 0) return 'No submissions\n'

  const allKeys = new Set<string>()
  const parsed = rows.map(r => {
    const data = JSON.parse(r.data_json) as Record<string, unknown>
    Object.keys(data).forEach(k => allKeys.add(k))
    return { row: r, data }
  })

  const fieldKeys = Array.from(allKeys)
  const header = ['id', 'started_at', 'completed_at', 'is_complete', 'status', 'last_step', ...fieldKeys]
  const lines = [header.map(csvCell).join(',')]

  for (const { row, data } of parsed) {
    const cells = [
      row.id, row.started_at, row.completed_at ?? '',
      row.is_complete ? 'yes' : 'no', row.status, String(row.last_step),
      ...fieldKeys.map(k => String(data[k] ?? '')),
    ]
    lines.push(cells.map(csvCell).join(','))
  }

  return lines.join('\n') + '\n'
}

function csvCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
