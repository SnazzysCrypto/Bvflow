import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFunnels } from '../../hooks/useFunnels'
import { FunnelCard } from './FunnelCard'
import { NewFunnelModal } from './NewFunnelModal'
import { Button } from '../../components/ui/Button'
import type { FunnelTemplate } from '../../types/templates'
import { createFunnel } from '../../utils/funnelDefaults'
import { funnelsApi } from '../../api/funnels'
import { useDashboardStore } from '../../store/dashboardStore'

type StatusFilter = 'all' | 'draft' | 'published' | 'archived'

export function Dashboard() {
  const navigate = useNavigate()
  const { funnels, loading, error, deleteFunnel, duplicateFunnel } = useFunnels()
  const upsertFunnel = useDashboardStore(s => s.upsertFunnel)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = funnels.filter(f => {
    const matchSearch = f.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || f.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleCreate = async (title: string, template?: FunnelTemplate) => {
    let data: any
    if (template) {
      data = { ...template.funnelSnapshot, title: title || template.name }
    } else {
      data = createFunnel(title)
    }
    try {
      const funnel = await funnelsApi.create(data)
      upsertFunnel(funnel)
      navigate(`/builder/${funnel.id}`)
    } catch {
      // toast shown by hook
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">B</span>
            </div>
            <span className="font-semibold text-gray-900">Bvflow</span>
          </div>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + New funnel
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search + filter */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <input
            type="text"
            placeholder="Search funnels..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] max-w-xs border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white outline-none focus:border-brand-400"
          />
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
            {(['all', 'draft', 'published', 'archived'] as StatusFilter[]).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">Loading funnels…</div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {funnels.length === 0 ? 'No funnels yet' : 'No funnels match your search'}
            </h3>
            <p className="text-gray-400 mb-6 text-sm">
              {funnels.length === 0 ? 'Create your first funnel to get started.' : 'Try adjusting your search or filters.'}
            </p>
            {funnels.length === 0 && (
              <Button variant="primary" onClick={() => setModalOpen(true)}>Create your first funnel</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(f => (
              <FunnelCard
                key={f.id}
                funnel={f}
                onDelete={deleteFunnel}
                onDuplicate={id => duplicateFunnel(id).then(copy => copy && navigate(`/builder/${copy.id}`))}
              />
            ))}
          </div>
        )}
      </main>

      <NewFunnelModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </div>
  )
}
