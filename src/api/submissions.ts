import { apiFetch } from './client'
import type { Submission } from '../types/analytics'

export interface SubmissionListResponse {
  total: number
  submissions: Submission[]
}

export const submissionsApi = {
  list: (funnelId: string, limit = 100, offset = 0) =>
    apiFetch<SubmissionListResponse>(`/api/funnels/${funnelId}/submissions?limit=${limit}&offset=${offset}`),
  csvUrl: (funnelId: string) => `/api/funnels/${funnelId}/submissions/csv`,
  updateStatus: (funnelId: string, submissionId: string, status: string) =>
    apiFetch(`/api/funnels/${funnelId}/submissions/${submissionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  delete: (funnelId: string, submissionId: string) =>
    apiFetch<void>(`/api/funnels/${funnelId}/submissions/${submissionId}`, { method: 'DELETE' }),
}
