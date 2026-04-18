import React, { useState, useEffect } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { templatesApi } from '../../api/templates'
import type { FunnelTemplate } from '../../types/templates'

interface NewFunnelModalProps {
  open: boolean
  onClose: () => void
  onCreate: (title: string, template?: FunnelTemplate) => void
}

export function NewFunnelModal({ open, onClose, onCreate }: NewFunnelModalProps) {
  const [tab, setTab] = useState<'blank' | 'template'>('blank')
  const [title, setTitle] = useState('')
  const [templates, setTemplates] = useState<FunnelTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<FunnelTemplate | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      templatesApi.list().then(setTemplates).catch(() => {})
      setTitle('')
      setSelectedTemplate(null)
    }
  }, [open])

  const handleCreate = () => {
    const name = title.trim() || (selectedTemplate ? selectedTemplate.name : 'New Funnel')
    onCreate(name, selectedTemplate ?? undefined)
    onClose()
  }

  const categoryColors: Record<string, string> = {
    Marketing: 'bg-purple-100 text-purple-700',
    Sales: 'bg-blue-100 text-blue-700',
    Utility: 'bg-gray-100 text-gray-600',
    Scheduling: 'bg-green-100 text-green-700',
  }

  return (
    <Modal open={open} onClose={onClose} title="Create new funnel" size="lg">
      <div className="p-6 flex flex-col gap-5">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {(['blank', 'template'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t === 'blank' ? 'Start blank' : 'From template'}
            </button>
          ))}
        </div>

        {tab === 'blank' ? (
          <div className="flex flex-col gap-4">
            <Input
              label="Funnel name"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Lead Generation Funnel"
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <Input
              label="Funnel name (optional — defaults to template name)"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Override template name..."
            />
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t)}
                  className={[
                    'text-left p-4 rounded-xl border-2 transition-all',
                    selectedTemplate?.id === t.id
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${categoryColors[t.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {t.category}
                    </span>
                    {selectedTemplate?.id === t.id && <span className="text-brand-600 text-xs">✓</span>}
                  </div>
                  <p className="font-semibold text-sm text-gray-900 mb-1">{t.name}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleCreate}
            loading={loading}
            disabled={tab === 'template' && !selectedTemplate}
          >
            Create funnel
          </Button>
        </div>
      </div>
    </Modal>
  )
}
