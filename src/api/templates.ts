import { apiFetch } from './client'
import type { FunnelTemplate } from '../types/templates'

export const templatesApi = {
  list: () => apiFetch<FunnelTemplate[]>('/api/templates'),
}
