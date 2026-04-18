import React from 'react'
import { useBuilderStore, useSelectedStep } from '../../../store/builderStore'
import { Input } from '../../../components/ui/Input'

export function StepInspector() {
  const step = useSelectedStep()
  const updateStep = useBuilderStore(s => s.updateStep)

  if (!step) return <div className="p-4 text-xs text-gray-400">Select a step.</div>

  const updateSettings = (settings: object) =>
    updateStep(step.id, { settings: { ...step.settings, ...settings } as any })

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Step info</h4>
        <Input label="Step title (internal)" value={step.title} onChange={e => updateStep(step.id, { title: e.target.value })} />
        <Input label="Step slug (optional)" value={step.slug ?? ''} onChange={e => updateStep(step.id, { slug: e.target.value || null })} placeholder="e.g. contact-details" />
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Navigation</h4>
        <Input label="Next button label" value={step.settings.nextButtonLabel} onChange={e => updateSettings({ nextButtonLabel: e.target.value })} />
        <Input label="Back button label" value={step.settings.backButtonLabel} onChange={e => updateSettings({ backButtonLabel: e.target.value })} />
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input type="checkbox" checked={step.settings.showBackButton} onChange={e => updateSettings({ showBackButton: e.target.checked })} className="accent-brand-600" />
          Show back button
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input type="checkbox" checked={step.settings.autoAdvance} onChange={e => updateSettings({ autoAdvance: e.target.checked })} className="accent-brand-600" />
          Auto-advance when choice selected
        </label>
        {step.settings.autoAdvance && (
          <Input label="Auto-advance delay (ms)" type="number" value={String(step.settings.autoAdvanceDelay)} onChange={e => updateSettings({ autoAdvanceDelay: Number(e.target.value) })} />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Completion</h4>
        <Input label="Redirect URL (last step only)" value={step.settings.completionRedirectUrl ?? ''} onChange={e => updateSettings({ completionRedirectUrl: e.target.value || null })} placeholder="https://..." />
      </div>
    </div>
  )
}
