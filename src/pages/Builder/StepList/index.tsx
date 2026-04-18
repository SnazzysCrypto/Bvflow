import React from 'react'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useBuilderStore } from '../../../store/builderStore'
import { StepItem } from './StepItem'

export function StepList() {
  const funnel = useBuilderStore(s => s.funnel)
  const selectedStepId = useBuilderStore(s => s.selectedStepId)
  const addStep = useBuilderStore(s => s.addStep)
  const reorderSteps = useBuilderStore(s => s.reorderSteps)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (!funnel) return null

  const steps = [...funnel.steps].sort((a, b) => a.order - b.order)

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = steps.findIndex(s => s.id === active.id)
    const newIndex = steps.findIndex(s => s.id === over.id)
    const newOrder = [...steps]
    const [moved] = newOrder.splice(oldIndex, 1)
    newOrder.splice(newIndex, 0, moved)
    reorderSteps(newOrder.map(s => s.id))
  }

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="px-3 py-2.5 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Steps</span>
        <span className="text-xs text-gray-400">{steps.length}</span>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
            {steps.map((step, i) => (
              <StepItem
                key={step.id}
                step={step}
                index={i}
                isSelected={step.id === selectedStepId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="p-2 border-t border-gray-100">
        <button
          onClick={() => addStep(selectedStepId ?? undefined)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-gray-300 text-xs text-gray-500 hover:border-brand-400 hover:text-brand-600 transition-colors"
        >
          + Add step
        </button>
      </div>
    </aside>
  )
}
