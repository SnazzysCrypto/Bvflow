import type { Funnel } from './funnel'

export interface FunnelTemplate {
  id: string
  name: string
  description: string
  category: string
  previewImageUrl: string
  funnelSnapshot: Omit<Funnel, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'status'>
}
