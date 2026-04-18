import { create } from 'zustand'
import type { Funnel, FunnelStep, BrandingConfig, FunnelSettings, LogicRule } from '../types/funnel'
import type { Block } from '../types/blocks'
import { createStep } from '../utils/stepDefaults'
import { genId } from '../utils/idGen'

interface BuilderState {
  funnel: Funnel | null
  selectedStepId: string | null
  selectedBlockId: string | null
  isDirty: boolean
  isSaving: boolean
  saveError: string | null

  loadFunnel: (funnel: Funnel) => void
  setSelectedStep: (stepId: string) => void
  setSelectedBlock: (blockId: string | null) => void
  updateFunnelMeta: (updates: Partial<Pick<Funnel, 'title' | 'description' | 'slug' | 'tags'>>) => void
  updateBranding: (updates: Partial<BrandingConfig>) => void
  updateFunnelSettings: (updates: Partial<FunnelSettings>) => void

  addStep: (afterStepId?: string) => void
  deleteStep: (stepId: string) => void
  reorderSteps: (orderedIds: string[]) => void
  updateStep: (stepId: string, updates: Partial<FunnelStep>) => void
  duplicateStep: (stepId: string) => void

  addBlock: (stepId: string, block: Block, afterBlockId?: string) => void
  updateBlock: (stepId: string, blockId: string, updates: Partial<Block>) => void
  deleteBlock: (stepId: string, blockId: string) => void
  reorderBlocks: (stepId: string, orderedIds: string[]) => void
  duplicateBlock: (stepId: string, blockId: string) => void

  addLogicRule: (stepId: string, rule: LogicRule) => void
  updateLogicRule: (stepId: string, ruleId: string, updates: Partial<LogicRule>) => void
  deleteLogicRule: (stepId: string, ruleId: string) => void

  markDirty: () => void
  markSaving: () => void
  markSaved: () => void
  markSaveError: (error: string) => void
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  funnel: null,
  selectedStepId: null,
  selectedBlockId: null,
  isDirty: false,
  isSaving: false,
  saveError: null,

  loadFunnel: (funnel) => set({
    funnel,
    selectedStepId: funnel.steps[0]?.id ?? null,
    selectedBlockId: null,
    isDirty: false,
  }),

  setSelectedStep: (stepId) => set({ selectedStepId: stepId, selectedBlockId: null }),
  setSelectedBlock: (blockId) => set({ selectedBlockId: blockId }),

  updateFunnelMeta: (updates) => set(s => ({
    funnel: s.funnel ? { ...s.funnel, ...updates } : null,
    isDirty: true,
  })),

  updateBranding: (updates) => set(s => ({
    funnel: s.funnel ? { ...s.funnel, branding: { ...s.funnel.branding, ...updates } } : null,
    isDirty: true,
  })),

  updateFunnelSettings: (updates) => set(s => ({
    funnel: s.funnel ? { ...s.funnel, settings: { ...s.funnel.settings, ...updates } } : null,
    isDirty: true,
  })),

  addStep: (afterStepId) => set(s => {
    if (!s.funnel) return {}
    const steps = [...s.funnel.steps]
    const afterIdx = afterStepId ? steps.findIndex(st => st.id === afterStepId) : steps.length - 1
    const insertAt = afterIdx >= 0 ? afterIdx + 1 : steps.length
    const newStep = createStep(s.funnel.id, insertAt)
    steps.splice(insertAt, 0, newStep)
    const reordered = steps.map((st, i) => ({ ...st, order: i }))
    return { funnel: { ...s.funnel, steps: reordered }, selectedStepId: newStep.id, isDirty: true }
  }),

  deleteStep: (stepId) => set(s => {
    if (!s.funnel) return {}
    const steps = s.funnel.steps.filter(st => st.id !== stepId).map((st, i) => ({ ...st, order: i }))
    const newSelected = steps[0]?.id ?? null
    return { funnel: { ...s.funnel, steps }, selectedStepId: newSelected, selectedBlockId: null, isDirty: true }
  }),

  reorderSteps: (orderedIds) => set(s => {
    if (!s.funnel) return {}
    const map = new Map(s.funnel.steps.map(st => [st.id, st]))
    const steps = orderedIds.map((id, i) => ({ ...map.get(id)!, order: i })).filter(Boolean)
    return { funnel: { ...s.funnel, steps }, isDirty: true }
  }),

  updateStep: (stepId, updates) => set(s => {
    if (!s.funnel) return {}
    const steps = s.funnel.steps.map(st => st.id === stepId ? { ...st, ...updates } : st)
    return { funnel: { ...s.funnel, steps }, isDirty: true }
  }),

  duplicateStep: (stepId) => set(s => {
    if (!s.funnel) return {}
    const steps = [...s.funnel.steps]
    const idx = steps.findIndex(st => st.id === stepId)
    if (idx < 0) return {}
    const original = steps[idx]
    const newStep: FunnelStep = {
      ...original,
      id: genId('step'),
      title: `${original.title} (copy)`,
      blocks: original.blocks.map(b => ({ ...b, id: genId('blk') })),
      logicRules: [],
    }
    steps.splice(idx + 1, 0, newStep)
    const reordered = steps.map((st, i) => ({ ...st, order: i }))
    return { funnel: { ...s.funnel, steps: reordered }, selectedStepId: newStep.id, isDirty: true }
  }),

  addBlock: (stepId, block, afterBlockId) => set(s => {
    if (!s.funnel) return {}
    const steps = s.funnel.steps.map(st => {
      if (st.id !== stepId) return st
      const blocks = [...st.blocks]
      const afterIdx = afterBlockId ? blocks.findIndex(b => b.id === afterBlockId) : blocks.length - 1
      blocks.splice(afterIdx >= 0 ? afterIdx + 1 : blocks.length, 0, block)
      return { ...st, blocks }
    })
    return { funnel: { ...s.funnel, steps }, selectedBlockId: block.id, isDirty: true }
  }),

  updateBlock: (stepId, blockId, updates) => set(s => {
    if (!s.funnel) return {}
    const steps = s.funnel.steps.map(st => {
      if (st.id !== stepId) return st
      const blocks = st.blocks.map(b => b.id === blockId ? { ...b, ...updates } as Block : b)
      return { ...st, blocks }
    })
    return { funnel: { ...s.funnel, steps }, isDirty: true }
  }),

  deleteBlock: (stepId, blockId) => set(s => {
    if (!s.funnel) return {}
    const steps = s.funnel.steps.map(st => {
      if (st.id !== stepId) return st
      return { ...st, blocks: st.blocks.filter(b => b.id !== blockId) }
    })
    return { funnel: { ...s.funnel, steps }, selectedBlockId: null, isDirty: true }
  }),

  reorderBlocks: (stepId, orderedIds) => set(s => {
    if (!s.funnel) return {}
    const steps = s.funnel.steps.map(st => {
      if (st.id !== stepId) return st
      const map = new Map(st.blocks.map(b => [b.id, b]))
      const blocks = orderedIds.map(id => map.get(id)!).filter(Boolean)
      return { ...st, blocks }
    })
    return { funnel: { ...s.funnel, steps }, isDirty: true }
  }),

  duplicateBlock: (stepId, blockId) => set(s => {
    if (!s.funnel) return {}
    const steps = s.funnel.steps.map(st => {
      if (st.id !== stepId) return st
      const blocks = [...st.blocks]
      const idx = blocks.findIndex(b => b.id === blockId)
      if (idx < 0) return st
      const newBlock = { ...blocks[idx], id: genId('blk') }
      blocks.splice(idx + 1, 0, newBlock)
      return { ...st, blocks }
    })
    return { funnel: { ...s.funnel, steps }, isDirty: true }
  }),

  addLogicRule: (stepId, rule) => set(s => {
    if (!s.funnel) return {}
    const steps = s.funnel.steps.map(st =>
      st.id === stepId ? { ...st, logicRules: [...st.logicRules, rule] } : st
    )
    return { funnel: { ...s.funnel, steps }, isDirty: true }
  }),

  updateLogicRule: (stepId, ruleId, updates) => set(s => {
    if (!s.funnel) return {}
    const steps = s.funnel.steps.map(st => {
      if (st.id !== stepId) return st
      return { ...st, logicRules: st.logicRules.map(r => r.id === ruleId ? { ...r, ...updates } : r) }
    })
    return { funnel: { ...s.funnel, steps }, isDirty: true }
  }),

  deleteLogicRule: (stepId, ruleId) => set(s => {
    if (!s.funnel) return {}
    const steps = s.funnel.steps.map(st =>
      st.id === stepId ? { ...st, logicRules: st.logicRules.filter(r => r.id !== ruleId) } : st
    )
    return { funnel: { ...s.funnel, steps }, isDirty: true }
  }),

  markDirty: () => set({ isDirty: true }),
  markSaving: () => set({ isSaving: true, saveError: null }),
  markSaved: () => set({ isSaving: false, isDirty: false, saveError: null }),
  markSaveError: (error) => set({ isSaving: false, saveError: error }),
}))

export function useSelectedStep() {
  return useBuilderStore(s => s.funnel?.steps.find(st => st.id === s.selectedStepId) ?? null)
}

export function useSelectedBlock() {
  const stepId = useBuilderStore(s => s.selectedStepId)
  const blockId = useBuilderStore(s => s.selectedBlockId)
  const funnel = useBuilderStore(s => s.funnel)
  if (!stepId || !blockId || !funnel) return null
  const step = funnel.steps.find(s => s.id === stepId)
  return step?.blocks.find(b => b.id === blockId) ?? null
}
