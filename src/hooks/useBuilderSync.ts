import { useEffect, useRef } from 'react'
import { useBuilderStore } from '../store/builderStore'
import { useUIStore } from '../store/uiStore'
import { funnelsApi } from '../api/funnels'

export function useBuilderSync() {
  const funnel = useBuilderStore(s => s.funnel)
  const isDirty = useBuilderStore(s => s.isDirty)
  const markSaving = useBuilderStore(s => s.markSaving)
  const markSaved = useBuilderStore(s => s.markSaved)
  const markSaveError = useBuilderStore(s => s.markSaveError)
  const addToast = useUIStore(s => s.addToast)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isDirty || !funnel) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      markSaving()
      try {
        await funnelsApi.update(funnel.id, funnel)
        markSaved()
      } catch (e: any) {
        markSaveError(e.message ?? 'Save failed')
        addToast('Save failed — check your connection', 'error')
      }
    }, 1000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [funnel, isDirty])
}
