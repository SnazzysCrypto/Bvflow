import React from 'react'
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useBuilderStore, useSelectedStep } from '../../../store/builderStore'
import { BlockItem } from './BlockItem'
import { AddBlockButton } from './AddBlockButton'

export function Canvas() {
  const step = useSelectedStep()
  const selectedBlockId = useBuilderStore(s => s.selectedBlockId)
  const setSelectedBlock = useBuilderStore(s => s.setSelectedBlock)
  const reorderBlocks = useBuilderStore(s => s.reorderBlocks)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  if (!step) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Select a step to start editing
      </div>
    )
  }

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (!over || active.id === over.id || !step) return
    const blocks = step.blocks
    const oldIdx = blocks.findIndex(b => b.id === active.id)
    const newIdx = blocks.findIndex(b => b.id === over.id)
    const reordered = [...blocks]
    const [moved] = reordered.splice(oldIdx, 1)
    reordered.splice(newIdx, 0, moved)
    reorderBlocks(step.id, reordered.map(b => b.id))
  }

  return (
    <main
      className="flex-1 overflow-y-auto bg-gray-100 flex justify-center"
      onClick={() => setSelectedBlock(null)}
    >
      <div
        className="w-full max-w-xl my-6 mx-4 bg-white rounded-xl shadow-sm border border-gray-200 min-h-[500px] relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Step header */}
        <div className="px-6 pt-5 pb-2 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{step.title}</p>
        </div>

        {/* Blocks */}
        <div className="px-3 py-4 flex flex-col gap-1 relative">
          {step.blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
              <span className="text-3xl">📦</span>
              <p className="text-sm">This step is empty</p>
              <AddBlockButton stepId={step.id} />
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={step.blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
                {step.blocks.map(block => (
                  <React.Fragment key={block.id}>
                    <BlockItem
                      block={block}
                      stepId={step.id}
                      isSelected={block.id === selectedBlockId}
                    />
                    <AddBlockButton stepId={step.id} afterBlockId={block.id} />
                  </React.Fragment>
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </main>
  )
}
