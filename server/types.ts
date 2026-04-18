export type FunnelStatus = 'draft' | 'published' | 'archived'

export interface FunnelRow {
  id: string
  slug: string
  title: string
  description: string
  status: FunnelStatus
  funnel_json: string
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface SubmissionRow {
  id: string
  funnel_id: string
  funnel_slug: string
  started_at: string
  completed_at: string | null
  data_json: string
  last_step: number
  total_steps: number
  is_complete: number
  metadata_json: string
  status: string
}

export interface AnalyticsEventRow {
  id: string
  funnel_id: string
  funnel_slug: string
  session_id: string
  event_type: string
  step_index: number | null
  step_id: string | null
  occurred_at: string
  metadata_json: string
}

export interface SubmitPayload {
  sessionId: string
  startedAt: string
  completedAt?: string
  data: Record<string, unknown>
  lastStep: number
  totalSteps: number
  isComplete: boolean
  metadata?: {
    userAgent?: string
    referrer?: string
    screenWidth?: number
    language?: string
  }
}

export interface AnalyticsEventPayload {
  funnelId: string
  funnelSlug: string
  sessionId: string
  eventType: string
  stepIndex?: number
  stepId?: string
  occurredAt: string
  metadata?: {
    userAgent?: string
    referrer?: string
    screenWidth?: number
  }
}
