import React from 'react'
import { useUIStore } from '../../../store/uiStore'
import { useBuilderStore } from '../../../store/builderStore'
import { Tabs } from '../../../components/ui/Tabs'
import { BlockInspector } from './BlockInspector'
import { StepInspector } from './StepInspector'
import { FunnelInspector } from './FunnelInspector'
import { LogicInspector } from './LogicInspector'

const TABS = [
  { id: 'block', label: 'Block' },
  { id: 'step', label: 'Step' },
  { id: 'funnel', label: 'Funnel' },
  { id: 'logic', label: 'Logic' },
]

export function Inspector() {
  const inspectorTab = useUIStore(s => s.inspectorTab)
  const setInspectorTab = useUIStore(s => s.setInspectorTab)
  const selectedBlockId = useBuilderStore(s => s.selectedBlockId)

  return (
    <aside className="w-64 shrink-0 bg-white border-l border-gray-200 flex flex-col h-full">
      <Tabs
        tabs={TABS}
        active={inspectorTab}
        onChange={id => setInspectorTab(id as any)}
      />
      <div className="flex-1 overflow-y-auto">
        {inspectorTab === 'block' && <BlockInspector />}
        {inspectorTab === 'step' && <StepInspector />}
        {inspectorTab === 'funnel' && <FunnelInspector />}
        {inspectorTab === 'logic' && <LogicInspector />}
      </div>
    </aside>
  )
}
