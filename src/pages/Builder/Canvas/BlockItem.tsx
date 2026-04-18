import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Block } from '../../../types/blocks'
import { BlockView } from '../../../components/blocks'
import { useBuilderStore } from '../../../store/builderStore'
import { useUIStore } from '../../../store/uiStore'

interface BlockItemProps {
  block: Block
  stepId: string
  isSelected: boolean
}

export function BlockItem({ block, stepId, isSelected }: BlockItemProps) {
  const { setSelectedBlock, deleteBlock, duplicateBlock } = useBuilderStore(s => ({
    setSelectedBlock: s.setSelectedBlock,
    deleteBlock: s.deleteBlock,
    duplicateBlock: s.duplicateBlock,
  }))
  const setInspectorTab = useUIStore(s => s.setInspectorTab)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const handleSelect = () => {
    setSelectedBlock(block.id)
    setInspectorTab('block')
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleSelect}
      className={[
        'group relative rounded-lg transition-all',
        isSelected
          ? 'ring-2 ring-brand-500 ring-offset-1'
          : 'hover:ring-1 hover:ring-gray-300 hover:ring-offset-1',
      ].join(' ')}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-gray-400 hover:text-gray-600 z-10"
        title="Drag to reorder"
      >
        ⠿
      </div>

      {/* Block content */}
      <div className={`px-4 py-3 ${block.hidden ? 'opacity-40' : ''}`}
        style={{
          marginTop: block.styles?.marginTop ? `${block.styles.marginTop}px` : undefined,
          marginBottom: block.styles?.marginBottom ? `${block.styles.marginBottom}px` : undefined,
          textAlign: block.styles?.textAlign ?? undefined,
          backgroundColor: block.styles?.backgroundColor ?? undefined,
        }}
      >
        <BlockView block={block} previewMode={false} />
      </div>

      {/* Action bar (visible when selected) */}
      {isSelected && (
        <div className="absolute -top-8 right-0 flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-1.5 py-1 shadow-sm z-20">
          <span className="text-xs text-gray-400 px-1">{block.type.replace(/_/g, ' ')}</span>
          <div className="w-px h-3 bg-gray-200" />
          <button
            onClick={e => { e.stopPropagation(); duplicateBlock(stepId, block.id) }}
            className="p-1 text-gray-500 hover:text-gray-800 rounded"
            title="Duplicate"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={e => { e.stopPropagation(); deleteBlock(stepId, block.id) }}
            className="p-1 text-gray-500 hover:text-red-600 rounded"
            title="Delete"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
