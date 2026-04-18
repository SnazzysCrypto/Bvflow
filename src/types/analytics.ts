export type AnalyticsEventType =
  | 'funnel_view' | 'step_view' | 'step_complete'
  | 'funnel_start' | 'funnel_complete' | 'funnel_abandon'

export interface AnalyticsEvent {
  id: string
  funnelId: string
  funnelSlug: string
  sessionId: string
  eventType: AnalyticsEventType
  stepIndex: number | null
  stepId: string | null
  occurredAt: string
  metadata: {
    userAgent: string | null
    referrer: string | null
    screenWidth: number | null
  }
}

export interface Submission {
  id: string
  funnelId: string
  funnelSlug: string
  startedAt: string
  completedAt: string | null
  data: Record<string, unknown>
  lastStep: number
  totalSteps: number
  isComplete: boolean
  metadata: {
    userAgent?: string
    referrer?: string
    screenWidth?: number
    language?: string
    sessionId?: string
  }
  status: 'new' | 'contacted' | 'closed'
}

export interface AnalyticsSummary {
  totalViews: number
  totalStarts: number
  totalCompletions: number
  completionRate: number
  stepBreakdown: {
    stepIndex: number
    stepId: string | null
    views: number
    completions: number
    dropOffRate: number
  }[]
}
