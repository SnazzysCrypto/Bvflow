import { useEffect } from 'react'
import { useDashboardStore } from '../store/dashboardStore'
import { useUIStore } from '../store/uiStore'
import { funnelsApi } from '../api/funnels'
import type { Funnel } from '../types/funnel'

export function useFunnels() {
  const { funnels, loading, error, loadFunnels, removeFunnel, upsertFunnel } = useDashboardStore()
  const addToast = useUIStore(s => s.addToast)

  useEffect(() => { loadFunnels() }, [])

  const deleteFunnel = async (id: string) => {
    try {
      await funnelsApi.delete(id)
      removeFunnel(id)
      addToast('Funnel deleted', 'success')
    } catch {
      addToast('Failed to delete funnel', 'error')
    }
  }

  const duplicateFunnel = async (id: string) => {
    try {
      const copy = await funnelsApi.duplicate(id)
      upsertFunnel(copy)
      addToast('Funnel duplicated', 'success')
      return copy
    } catch {
      addToast('Failed to duplicate funnel', 'error')
    }
  }

  const createFunnel = async (data: Partial<Funnel>) => {
    try {
      const f = await funnelsApi.create(data)
      upsertFunnel(f)
      return f
    } catch {
      addToast('Failed to create funnel', 'error')
    }
  }

  return { funnels, loading, error, deleteFunnel, duplicateFunnel, createFunnel }
}
