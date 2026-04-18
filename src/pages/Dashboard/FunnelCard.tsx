import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Funnel } from '../../types/funnel'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'

interface FunnelCardProps {
  funnel: Funnel
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
}

export function FunnelCard({ funnel, onDelete, onDuplicate }: FunnelCardProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const updatedAt = new Date(funnel.updatedAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  const statusVariant = funnel.status === 'published' ? 'published'
    : funnel.status === 'archived' ? 'archived' : 'draft'

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-brand-300 hover:shadow-sm transition-all group relative">
      {/* Status + menu */}
      <div className="flex items-center justify-between mb-3">
        <Badge variant={statusVariant}>{funnel.status}</Badge>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-all"
          >
            ···
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-7 z-20 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px]">
                <button
                  onClick={() => { navigate(`/builder/${funnel.id}`); setMenuOpen(false) }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Open builder
                </button>
                <button
                  onClick={() => { onDuplicate(funnel.id); setMenuOpen(false) }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => { navigate(`/submissions/${funnel.id}`); setMenuOpen(false) }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  View submissions
                </button>
                <button
                  onClick={() => { navigate(`/analytics/${funnel.id}`); setMenuOpen(false) }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Analytics
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => { onDelete(funnel.id); setMenuOpen(false) }}
                  className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h3
        onClick={() => navigate(`/builder/${funnel.id}`)}
        className="font-semibold text-gray-900 mb-1 cursor-pointer hover:text-brand-600 transition-colors line-clamp-2"
      >
        {funnel.title}
      </h3>
      {funnel.description && (
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{funnel.description}</p>
      )}

      {/* Meta */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
        <span className="text-xs text-gray-400">{funnel.steps?.length ?? 0} steps · Updated {updatedAt}</span>
        <Button size="sm" variant="primary" onClick={() => navigate(`/builder/${funnel.id}`)}>
          Edit
        </Button>
      </div>
    </div>
  )
}
