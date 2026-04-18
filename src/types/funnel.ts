import type { Block } from './blocks'

export type FunnelStatus = 'draft' | 'published' | 'archived'

export type LogicOperator =
  | 'equals' | 'not_equals' | 'contains' | 'not_contains'
  | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than'
  | 'is_empty' | 'is_not_empty' | 'is_checked' | 'is_not_checked'

export interface LogicCondition {
  id: string
  sourceFieldId: string
  operator: LogicOperator
  value: string | number | boolean | null
}

export type LogicAction =
  | { type: 'jump_to_step'; stepId: string }
  | { type: 'skip_step'; stepId: string }
  | { type: 'show_block'; blockId: string }
  | { type: 'hide_block'; blockId: string }
  | { type: 'set_field_value'; fieldId: string; value: string }
  | { type: 'end_funnel'; outcome: 'success' | 'disqualify' }

export interface LogicRule {
  id: string
  name: string
  conditions: LogicCondition[]
  conditionOperator: 'AND' | 'OR'
  actions: LogicAction[]
  enabled: boolean
}

export interface BrandingConfig {
  primaryColor: string
  accentColor: string
  backgroundColor: string
  fontFamily: string
  logoUrl: string | null
  logoAlt: string
  faviconUrl: string | null
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
  buttonStyle: 'filled' | 'outline' | 'ghost'
  progressBar: boolean
  progressBarColor: string | null
  customCss: string
}

export interface FunnelStepSettings {
  showProgressBar: boolean
  nextButtonLabel: string
  backButtonLabel: string
  showBackButton: boolean
  autoAdvance: boolean
  autoAdvanceDelay: number
  completionRedirectUrl: string | null
}

export interface FunnelStep {
  id: string
  funnelId: string
  order: number
  title: string
  slug: string | null
  blocks: Block[]
  logicRules: LogicRule[]
  settings: FunnelStepSettings
}

export interface FunnelSettings {
  metaTitle: string | null
  metaDescription: string | null
  submissionWebhookUrl: string | null
  notifyEmail: string | null
  allowMultipleSubmissions: boolean
  showPoweredBy: boolean
  redirectAfterSubmit: string | null
  thankYouMessage: string | null
}

export interface Funnel {
  id: string
  title: string
  description: string
  slug: string
  status: FunnelStatus
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  steps: FunnelStep[]
  branding: BrandingConfig
  settings: FunnelSettings
  templateId: string | null
  tags: string[]
}
