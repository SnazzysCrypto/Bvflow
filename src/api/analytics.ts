import { apiFetch } from './client'
import type { AnalyticsSummary } from '../types/analytics'

export const analyticsApi = {
  getSummary: (funnelId: string) => apiFetch<AnalyticsSummary>(`/api/funnels/${funnelId}/analytics`),
}
