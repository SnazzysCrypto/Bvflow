import { apiFetch } from './client'
import type { Funnel } from '../types/funnel'

export const funnelsApi = {
  list: () => apiFetch<Funnel[]>('/api/funnels'),
  get: (id: string) => apiFetch<Funnel>(`/api/funnels/${id}`),
  create: (data: Partial<Funnel>) => apiFetch<Funnel>('/api/funnels', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Funnel) => apiFetch<Funnel>(`/api/funnels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch<void>(`/api/funnels/${id}`, { method: 'DELETE' }),
  duplicate: (id: string) => apiFetch<Funnel>(`/api/funnels/${id}/duplicate`, { method: 'POST' }),
  publish: (id: string) => apiFetch<Funnel>(`/api/funnels/${id}/publish`, { method: 'POST' }),
  unpublish: (id: string) => apiFetch<Funnel>(`/api/funnels/${id}/unpublish`, { method: 'POST' }),
  exportUrl: (id: string) => `/api/funnels/${id}/export`,
}
