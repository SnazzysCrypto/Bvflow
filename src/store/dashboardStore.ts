import { create } from 'zustand'
import type { Funnel } from '../types/funnel'
import { funnelsApi } from '../api/funnels'

interface DashboardState {
  funnels: Funnel[]
  loading: boolean
  error: string | null

  loadFunnels: () => Promise<void>
  removeFunnel: (id: string) => void
  upsertFunnel: (funnel: Funnel) => void
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  funnels: [],
  loading: false,
  error: null,

  loadFunnels: async () => {
    set({ loading: true, error: null })
    try {
      const funnels = await funnelsApi.list()
      set({ funnels, loading: false })
    } catch (e: any) {
      set({ error: e.message ?? 'Failed to load funnels', loading: false })
    }
  },

  removeFunnel: (id) => set(s => ({ funnels: s.funnels.filter(f => f.id !== id) })),

  upsertFunnel: (funnel) => set(s => {
    const exists = s.funnels.some(f => f.id === funnel.id)
    return {
      funnels: exists
        ? s.funnels.map(f => f.id === funnel.id ? funnel : f)
        : [funnel, ...s.funnels],
    }
  }),
}))
