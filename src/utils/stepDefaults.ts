import { genId } from './idGen'
import type { FunnelStep } from '../types/funnel'

export function createStep(funnelId: string, order: number): FunnelStep {
  return {
    id: genId('step'),
    funnelId,
    order,
    title: `Step ${order + 1}`,
    slug: null,
    blocks: [],
    logicRules: [],
    settings: {
      showProgressBar: true,
      nextButtonLabel: 'Continue',
      backButtonLabel: '← Back',
      showBackButton: true,
      autoAdvance: false,
      autoAdvanceDelay: 400,
      completionRedirectUrl: null,
    },
  }
}
