import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FunnelStep } from '../../../types/funnel'
import { useBuilderStore } from '../../../store/builderStore'

interface StepItemProps {
  step: FunnelStep
  index: number
  isSelected: boolean
}

export function StepItem({ step, index, isSelected }: StepItemProps) {
  const { setSelectedStep, deleteStep, duplicateStep, funnel } = useBuilderStore(s => ({
    setSelectedStep: s.setSelectedStep,
    deleteStep: s.deleteStep,
    duplicateStep: s.duplicateStep,
    funnel: s.funnel,
  }))

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const canDelete = (funnel?.steps.length ?? 0) > 1

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => setSelectedStep(step.id)}
      className={[
        'group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors',
        isSelected ? 'bg-brand-50 border border-brand-200' : 'hover:bg-gray-50 border border-transparent',
      ].join(' ')}
    >
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-300 hover:text-gray-500 text-xs select-none shrink-0"
        title="Drag to reorder"
      >
        ⠿
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className={`text-xs font-medium shrink-0 ${isSelected ? 'text-brand-600' : 'text-gray-400'}`}>
            {index + 1}
          </span>
          <span className="text-sm text-gray-800 truncate">{step.title}</span>
        </div>
        <span className="text-xs text-gray-400">{step.blocks.length} block{step.blocks.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={e => { e.stopPropagation(); duplicateStep(step.id) }}
          className="p-1 text-gray-400 hover:text-gray-700 rounded"
          title="Duplicate step"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        {canDelete && (
          <button
            onClick={e => { e.stopPropagation(); deleteStep(step.id) }}
            className="p-1 text-gray-400 hover:text-red-500 rounded"
            title="Delete step"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
