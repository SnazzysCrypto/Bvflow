import { create } from 'zustand'

type InspectorTab = 'block' | 'step' | 'funnel' | 'logic'
type PreviewMode = 'desktop' | 'mobile' | null

interface UIState {
  inspectorTab: InspectorTab
  previewMode: PreviewMode
  blockPickerOpen: boolean
  blockPickerAnchorId: string | null
  previewOpen: boolean
  toasts: Toast[]

  setInspectorTab: (tab: InspectorTab) => void
  setPreviewMode: (mode: PreviewMode) => void
  openBlockPicker: (anchorId?: string) => void
  closeBlockPicker: () => void
  openPreview: () => void
  closePreview: () => void
  addToast: (msg: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export const useUIStore = create<UIState>((set, get) => ({
  inspectorTab: 'block',
  previewMode: null,
  blockPickerOpen: false,
  blockPickerAnchorId: null,
  previewOpen: false,
  toasts: [],

  setInspectorTab: (tab) => set({ inspectorTab: tab }),
  setPreviewMode: (mode) => set({ previewMode: mode }),

  openBlockPicker: (anchorId) => set({ blockPickerOpen: true, blockPickerAnchorId: anchorId ?? null }),
  closeBlockPicker: () => set({ blockPickerOpen: false, blockPickerAnchorId: null }),

  openPreview: () => set({ previewOpen: true }),
  closePreview: () => set({ previewOpen: false }),

  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).slice(2)
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => get().removeToast(id), 3500)
  },

  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))
