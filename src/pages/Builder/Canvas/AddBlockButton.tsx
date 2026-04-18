import React, { useState } from 'react'
import { useBuilderStore } from '../../../store/builderStore'
import { createBlock } from '../../../utils/blockDefaults'
import { BLOCK_TYPE_META, BLOCK_CATEGORIES } from '../../../constants/blockTypes'
import type { BlockType } from '../../../types/blocks'

interface AddBlockButtonProps {
  stepId: string
  afterBlockId?: string
}

export function AddBlockButton({ stepId, afterBlockId }: AddBlockButtonProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const addBlock = useBuilderStore(s => s.addBlock)

  const filtered = BLOCK_TYPE_META.filter(b =>
    !search || b.label.toLowerCase().includes(search.toLowerCase()) || b.category.includes(search.toLowerCase())
  )

  const handleAdd = (type: BlockType) => {
    addBlock(stepId, createBlock(type), afterBlockId)
    setOpen(false)
    setSearch('')
  }

  return (
    <div className="relative flex justify-center">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-dashed border-gray-300 text-xs text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors bg-white"
      >
        + Add block
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => { setOpen(false); setSearch('') }} />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <input
                autoFocus
                type="text"
                placeholder="Search blocks..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-md outline-none focus:border-brand-400"
              />
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {BLOCK_CATEGORIES.map(cat => {
                const items = filtered.filter(b => b.category === cat)
                if (!items.length) return null
                return (
                  <div key={cat} className="mb-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-1 capitalize">{cat}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {items.map(b => (
                        <button
                          key={b.type}
                          onClick={() => handleAdd(b.type)}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-brand-50 text-left transition-colors"
                        >
                          <span className="text-base w-5 text-center shrink-0">{b.icon}</span>
                          <span className="text-xs text-gray-700 truncate">{b.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
              {!filtered.length && (
                <p className="text-xs text-gray-400 text-center py-4">No blocks found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
