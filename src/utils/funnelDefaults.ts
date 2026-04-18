import { genId } from './idGen'
import type { Funnel, BrandingConfig, FunnelSettings } from '../types/funnel'
import { createStep } from './stepDefaults'
import { createBlock } from './blockDefaults'

export const DEFAULT_BRANDING: BrandingConfig = {
  primaryColor: '#6471f5',
  accentColor: '#a5b8fd',
  backgroundColor: '#f8f9fa',
  fontFamily: 'Inter',
  logoUrl: null,
  logoAlt: '',
  faviconUrl: null,
  borderRadius: 'md',
  buttonStyle: 'filled',
  progressBar: true,
  progressBarColor: null,
  customCss: '',
}

export const DEFAULT_SETTINGS: FunnelSettings = {
  metaTitle: null,
  metaDescription: null,
  submissionWebhookUrl: null,
  notifyEmail: null,
  allowMultipleSubmissions: true,
  showPoweredBy: false,
  redirectAfterSubmit: null,
  thankYouMessage: null,
}

export function createFunnel(title: string): Funnel {
  const id = genId('fnl')
  const now = new Date().toISOString()
  const slug = slugify(title)

  const step = createStep(id, 0)
  step.blocks = [
    createBlock('heading'),
    createBlock('paragraph'),
    createBlock('button'),
  ]

  return {
    id,
    title,
    description: '',
    slug,
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    publishedAt: null,
    steps: [step],
    branding: { ...DEFAULT_BRANDING },
    settings: { ...DEFAULT_SETTINGS },
    templateId: null,
    tags: [],
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'funnel'
}
