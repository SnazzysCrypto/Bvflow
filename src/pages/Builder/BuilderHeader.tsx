import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useBuilderStore } from '../../store/builderStore'
import { useUIStore } from '../../store/uiStore'
import { funnelsApi } from '../../api/funnels'
import { Button } from '../../components/ui/Button'

export function BuilderHeader() {
  const navigate = useNavigate()
  const funnel = useBuilderStore(s => s.funnel)
  const isDirty = useBuilderStore(s => s.isDirty)
  const isSaving = useBuilderStore(s => s.isSaving)
  const saveError = useBuilderStore(s => s.saveError)
  const markSaving = useBuilderStore(s => s.markSaving)
  const markSaved = useBuilderStore(s => s.markSaved)
  const markSaveError = useBuilderStore(s => s.markSaveError)
  const openPreview = useUIStore(s => s.openPreview)
  const addToast = useUIStore(s => s.addToast)

  const handleSave = async () => {
    if (!funnel) return
    markSaving()
    try {
      await funnelsApi.update(funnel.id, funnel)
      markSaved()
      addToast('Saved', 'success')
    } catch (e: any) {
      markSaveError(e.message)
      addToast('Save failed', 'error')
    }
  }

  const handlePublish = async () => {
    if (!funnel) return
    try {
      await funnelsApi.publish(funnel.id)
      addToast('Funnel published', 'success')
      // Trigger export download
      window.open(funnelsApi.exportUrl(funnel.id), '_blank')
    } catch {
      addToast('Publish failed', 'error')
    }
  }

  const saveStatus = isSaving ? 'Saving…'
    : saveError ? '⚠ Save failed'
    : isDirty ? 'Unsaved changes'
    : 'Saved'

  const saveColor = saveError ? 'text-red-400'
    : isDirty ? 'text-amber-500'
    : 'text-green-500'

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4 gap-3 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-gray-700 transition-colors"
          title="Back to dashboard"
        >
          ←
        </button>
        <h1 className="font-semibold text-sm text-gray-900 max-w-[200px] truncate">
          {funnel?.title ?? 'Loading…'}
        </h1>
        <span className={`text-xs ${saveColor}`}>{saveStatus}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={handleSave} disabled={!isDirty}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={openPreview}>
          Preview
        </Button>
        <Button size="sm" variant="primary" onClick={handlePublish}>
          Publish & Export
        </Button>
      </div>
    </header>
  )
}
