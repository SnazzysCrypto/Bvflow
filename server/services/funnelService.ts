import { getDb } from '../db/client.js'
import type { FunnelRow } from '../types.js'

export function listFunnels(): FunnelRow[] {
  return getDb().prepare('SELECT * FROM funnels ORDER BY updated_at DESC').all() as FunnelRow[]
}

export function getFunnelById(id: string): FunnelRow | null {
  return (getDb().prepare('SELECT * FROM funnels WHERE id = ?').get(id) as FunnelRow) ?? null
}

export function getFunnelBySlug(slug: string): FunnelRow | null {
  return (getDb().prepare('SELECT * FROM funnels WHERE slug = ?').get(slug) as FunnelRow) ?? null
}

export function createFunnel(row: Omit<FunnelRow, 'published_at'> & { published_at?: string | null }): FunnelRow {
  const db = getDb()
  db.prepare(`
    INSERT INTO funnels (id, slug, title, description, status, funnel_json, created_at, updated_at, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    row.id, row.slug, row.title, row.description,
    row.status, row.funnel_json, row.created_at, row.updated_at,
    row.published_at ?? null
  )
  return getFunnelById(row.id)!
}

export function updateFunnel(id: string, row: Partial<FunnelRow>): FunnelRow | null {
  const db = getDb()
  const existing = getFunnelById(id)
  if (!existing) return null

  const updated = { ...existing, ...row, updated_at: new Date().toISOString() }
  db.prepare(`
    UPDATE funnels
    SET slug = ?, title = ?, description = ?, status = ?, funnel_json = ?,
        updated_at = ?, published_at = ?
    WHERE id = ?
  `).run(
    updated.slug, updated.title, updated.description, updated.status,
    updated.funnel_json, updated.updated_at, updated.published_at ?? null, id
  )
  return getFunnelById(id)!
}

export function deleteFunnel(id: string): boolean {
  const result = getDb().prepare('DELETE FROM funnels WHERE id = ?').run(id)
  return result.changes > 0
}

export function slugExists(slug: string, excludeId?: string): boolean {
  if (excludeId) {
    return !!getDb().prepare('SELECT 1 FROM funnels WHERE slug = ? AND id != ?').get(slug, excludeId)
  }
  return !!getDb().prepare('SELECT 1 FROM funnels WHERE slug = ?').get(slug)
}
