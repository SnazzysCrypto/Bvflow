import React, { useState, useCallback } from 'react'
import type { Funnel, FunnelStep } from '../../types/funnel'
import type { Block } from '../../types/blocks'
import { BlockView } from '../../components/blocks'
import { evaluateLogicRules } from '../../utils/logicEvaluator'
import { validateStep } from '../../utils/validateStep'
import type { ValidationError } from '../../utils/validateStep'

interface PreviewFrameProps {
  funnel: Funnel
  mobile?: boolean
}

export function PreviewFrame({ funnel, mobile }: PreviewFrameProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [history, setHistory] = useState<number[]>([0])
  const [formValues, setFormValues] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [disqualified, setDisqualified] = useState(false)

  const step = funnel.steps[currentStepIndex]
  const branding = funnel.branding

  const evalResult = step
    ? evaluateLogicRules(step.logicRules, formValues)
    : { hiddenBlocks: new Set<string>(), nextStepId: null, endFunnel: false, endOutcome: null }

  const handleFieldChange = useCallback((fieldName: string, value: unknown) => {
    setFormValues(prev => ({ ...prev, [fieldName]: value }))
    setErrors(prev => prev.filter(e => e.fieldName !== fieldName))
  }, [])

  const goNext = () => {
    if (!step) return
    const errs = validateStep(step, formValues, evalResult.hiddenBlocks)
    if (errs.length > 0) { setErrors(errs); return }

    setErrors([])

    if (evalResult.endFunnel) {
      if (evalResult.endOutcome === 'disqualify') { setDisqualified(true); return }
      setSubmitted(true); return
    }

    let nextIdx = currentStepIndex + 1
    if (evalResult.nextStepId) {
      const found = funnel.steps.findIndex(s => s.id === evalResult.nextStepId)
      if (found >= 0) nextIdx = found
    }

    if (nextIdx >= funnel.steps.length) { setSubmitted(true); return }

    setHistory(prev => [...prev, nextIdx])
    setCurrentStepIndex(nextIdx)
  }

  const goBack = () => {
    if (history.length <= 1) return
    const newHistory = history.slice(0, -1)
    setHistory(newHistory)
    setCurrentStepIndex(newHistory[newHistory.length - 1])
    setErrors([])
  }

  const radius = { none: '0', sm: '4px', md: '12px', lg: '20px', full: '9999px' }[branding.borderRadius] ?? '12px'

  const brandVars = {
    '--funnel-primary': branding.primaryColor,
    '--funnel-bg': branding.backgroundColor,
    '--funnel-radius': radius,
  } as React.CSSProperties

  const pct = funnel.steps.length > 0 ? Math.round((currentStepIndex / funnel.steps.length) * 100) : 0

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-full p-6" style={brandVars}>
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-lg w-full">
          <div className="text-4xl mb-4">✓</div>
          {funnel.settings.thankYouMessage ? (
            <div dangerouslySetInnerHTML={{ __html: funnel.settings.thankYouMessage }} />
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
              <p className="text-gray-500">Your response has been submitted successfully.</p>
            </>
          )}
        </div>
      </div>
    )
  }

  if (disqualified) {
    return (
      <div className="flex items-center justify-center min-h-full p-6" style={brandVars}>
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-lg w-full">
          <div className="text-4xl mb-4">🙏</div>
          <h2 className="text-2xl font-bold mb-2">Thanks for your interest</h2>
          <p className="text-gray-500">Based on your answers, we may not be the best fit right now.</p>
        </div>
      </div>
    )
  }

  if (!step) return <div className="p-8 text-gray-400 text-center">No steps in this funnel.</div>

  const hasNavButton = step.blocks.some(b => b.type === 'button' && ['next_step', 'submit', 'prev_step'].includes((b as any).config?.action))
  const isLast = currentStepIndex === funnel.steps.length - 1

  return (
    <div
      className="min-h-full flex items-center justify-center p-4"
      style={{ ...brandVars, backgroundColor: branding.backgroundColor, fontFamily: branding.fontFamily !== 'system' ? branding.fontFamily : undefined }}
    >
      <div
        className="w-full bg-white shadow-md overflow-hidden"
        style={{ maxWidth: mobile ? '390px' : '640px', borderRadius: radius }}
      >
        {/* Progress bar */}
        {branding.progressBar && (
          <div className="h-1 bg-gray-100">
            <div
              className="h-full transition-all duration-400"
              style={{ width: `${pct}%`, backgroundColor: branding.progressBarColor ?? branding.primaryColor }}
            />
          </div>
        )}

        <div className="p-8 flex flex-col gap-4">
          {/* Logo */}
          {branding.logoUrl && (
            <div className="mb-2">
              <img src={branding.logoUrl} alt={branding.logoAlt} className="h-10" />
            </div>
          )}

          {/* Blocks */}
          {step.blocks.map(block => {
            if (evalResult.hiddenBlocks.has(block.id) || block.hidden) return null
            const cfg = (block as any).config ?? {}
            const fn = cfg.fieldName ?? block.id
            const fieldError = errors.find(e => e.fieldName === fn)?.message

            if (block.type === 'button') {
              const action = cfg.action
              const isNextOrSubmit = action === 'next_step' || action === 'submit'
              const isBack = action === 'prev_step'
              if (isNextOrSubmit) {
                return (
                  <div key={block.id} style={{ textAlign: block.styles?.textAlign ?? 'center' }}>
                    <button
                      onClick={goNext}
                      className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${cfg.fullWidth ? 'w-full' : ''}`}
                      style={{ backgroundColor: cfg.color ?? branding.primaryColor, borderRadius: radius }}
                    >
                      {cfg.label || (isLast ? 'Submit' : 'Continue')}
                    </button>
                  </div>
                )
              }
              if (isBack) {
                return (
                  <button key={block.id} onClick={goBack} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    {cfg.label || '← Back'}
                  </button>
                )
              }
              if (action === 'url') {
                return (
                  <div key={block.id} style={{ textAlign: block.styles?.textAlign ?? 'center' }}>
                    <a
                      href={cfg.url ?? '#'}
                      target={cfg.openInNewTab ? '_blank' : '_self'}
                      rel="noreferrer"
                      className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${cfg.fullWidth ? 'w-full' : ''}`}
                      style={{ backgroundColor: cfg.color ?? branding.primaryColor, color: cfg.textColor ?? '#fff', borderRadius: radius }}
                    >
                      {cfg.label || 'Click here'}
                    </a>
                  </div>
                )
              }
            }

            return (
              <div key={block.id}
                style={{
                  marginTop: block.styles?.marginTop ? `${block.styles.marginTop}px` : undefined,
                  marginBottom: block.styles?.marginBottom ? `${block.styles.marginBottom}px` : undefined,
                  textAlign: block.styles?.textAlign ?? undefined,
                }}
              >
                <BlockView
                  block={block}
                  previewMode
                  formValues={formValues}
                  onFieldChange={handleFieldChange}
                  fieldError={fieldError}
                />
              </div>
            )
          })}

          {/* Auto navigation */}
          {!hasNavButton && (
            <div className="flex items-center gap-3 mt-2">
              {step.settings.showBackButton && history.length > 1 && (
                <button onClick={goBack} className="text-sm text-gray-500 hover:text-gray-700">
                  {step.settings.backButtonLabel || '← Back'}
                </button>
              )}
              <button
                onClick={goNext}
                className="flex-1 py-3 rounded-lg font-semibold text-white transition-colors"
                style={{ backgroundColor: branding.primaryColor, borderRadius: radius }}
              >
                {isLast ? 'Submit' : (step.settings.nextButtonLabel || 'Continue')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
