import React from 'react'
import { useBuilderStore, useSelectedStep } from '../../../store/builderStore'
import { genId } from '../../../utils/idGen'
import type { LogicRule, LogicCondition, LogicAction } from '../../../types/funnel'
import { isFormField } from '../../../types/blocks'

export function LogicInspector() {
  const step = useSelectedStep()
  const funnel = useBuilderStore(s => s.funnel)
  const addLogicRule = useBuilderStore(s => s.addLogicRule)
  const updateLogicRule = useBuilderStore(s => s.updateLogicRule)
  const deleteLogicRule = useBuilderStore(s => s.deleteLogicRule)

  if (!step || !funnel) return <div className="p-4 text-xs text-gray-400">Select a step to add logic.</div>

  const fieldBlocks = step.blocks.filter(b => isFormField(b.type))

  const addRule = () => {
    const rule: LogicRule = {
      id: genId('rule'),
      name: 'New rule',
      conditions: [],
      conditionOperator: 'AND',
      actions: [],
      enabled: true,
    }
    addLogicRule(step.id, rule)
  }

  const addCondition = (ruleId: string) => {
    const rule = step.logicRules.find(r => r.id === ruleId)!
    const cond: LogicCondition = {
      id: genId('cond'),
      sourceFieldId: fieldBlocks[0]?.id ?? '',
      operator: 'equals',
      value: '',
    }
    updateLogicRule(step.id, ruleId, { conditions: [...rule.conditions, cond] })
  }

  const updateCondition = (ruleId: string, condId: string, updates: Partial<LogicCondition>) => {
    const rule = step.logicRules.find(r => r.id === ruleId)!
    updateLogicRule(step.id, ruleId, {
      conditions: rule.conditions.map(c => c.id === condId ? { ...c, ...updates } : c),
    })
  }

  const removeCondition = (ruleId: string, condId: string) => {
    const rule = step.logicRules.find(r => r.id === ruleId)!
    updateLogicRule(step.id, ruleId, { conditions: rule.conditions.filter(c => c.id !== condId) })
  }

  const setAction = (ruleId: string, action: LogicAction) => {
    updateLogicRule(step.id, ruleId, { actions: [action] })
  }

  const operators = [
    { label: 'equals', value: 'equals' },
    { label: 'does not equal', value: 'not_equals' },
    { label: 'contains', value: 'contains' },
    { label: 'is empty', value: 'is_empty' },
    { label: 'is not empty', value: 'is_not_empty' },
    { label: 'is checked', value: 'is_checked' },
  ]

  const otherSteps = funnel.steps.filter(s => s.id !== step.id)

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Logic rules</h4>
        <button onClick={addRule} className="text-xs text-brand-600 hover:text-brand-700 font-medium">+ Add rule</button>
      </div>

      {step.logicRules.length === 0 && (
        <div className="text-xs text-gray-400 text-center py-4 border border-dashed border-gray-200 rounded-lg">
          No logic rules yet.<br />Add a rule to control what happens based on answers.
        </div>
      )}

      {step.logicRules.map(rule => (
        <div key={rule.id} className="border border-gray-200 rounded-lg overflow-hidden">
          {/* Rule header */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
            <input
              type="text"
              value={rule.name}
              onChange={e => updateLogicRule(step.id, rule.id, { name: e.target.value })}
              className="flex-1 text-xs font-medium bg-transparent outline-none text-gray-700"
            />
            <label className="flex items-center gap-1 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" checked={rule.enabled} onChange={e => updateLogicRule(step.id, rule.id, { enabled: e.target.checked })} className="accent-brand-600" />
              On
            </label>
            <button onClick={() => deleteLogicRule(step.id, rule.id)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
          </div>

          <div className="p-3 flex flex-col gap-3">
            {/* Conditions */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">IF</span>
                {rule.conditions.length > 1 && (
                  <select
                    value={rule.conditionOperator}
                    onChange={e => updateLogicRule(step.id, rule.id, { conditionOperator: e.target.value as any })}
                    className="text-xs border border-gray-200 rounded px-1 py-0.5"
                  >
                    <option value="AND">ALL (AND)</option>
                    <option value="OR">ANY (OR)</option>
                  </select>
                )}
              </div>

              {rule.conditions.map(cond => (
                <div key={cond.id} className="flex flex-col gap-1.5 p-2 bg-gray-50 rounded-lg">
                  <select
                    value={cond.sourceFieldId}
                    onChange={e => updateCondition(rule.id, cond.id, { sourceFieldId: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="">Select field…</option>
                    {fieldBlocks.map(b => (
                      <option key={b.id} value={b.id}>{(b as any).config?.label || b.type}</option>
                    ))}
                  </select>
                  <select
                    value={cond.operator}
                    onChange={e => updateCondition(rule.id, cond.id, { operator: e.target.value as any })}
                    className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                  >
                    {operators.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  {!['is_empty', 'is_not_empty', 'is_checked', 'is_not_checked'].includes(cond.operator) && (
                    <input
                      type="text"
                      placeholder="Value..."
                      value={String(cond.value ?? '')}
                      onChange={e => updateCondition(rule.id, cond.id, { value: e.target.value })}
                      className="w-full text-xs border border-gray-200 rounded px-2 py-1"
                    />
                  )}
                  <button onClick={() => removeCondition(rule.id, cond.id)} className="text-xs text-red-400 text-left">Remove condition</button>
                </div>
              ))}

              <button
                onClick={() => addCondition(rule.id)}
                className="text-xs text-brand-600 text-left hover:text-brand-700"
                disabled={fieldBlocks.length === 0}
              >
                {fieldBlocks.length === 0 ? 'Add form fields to this step first' : '+ Add condition'}
              </button>
            </div>

            {/* Action */}
            <div className="flex flex-col gap-2">
              <span className="text-xs text-gray-500 font-medium">THEN</span>
              <select
                value={rule.actions[0]?.type ?? ''}
                onChange={e => {
                  const type = e.target.value
                  if (!type) return
                  if (type === 'jump_to_step') setAction(rule.id, { type: 'jump_to_step', stepId: otherSteps[0]?.id ?? '' })
                  else if (type === 'end_funnel') setAction(rule.id, { type: 'end_funnel', outcome: 'success' })
                  else if (type === 'hide_block') setAction(rule.id, { type: 'hide_block', blockId: '' })
                  else if (type === 'show_block') setAction(rule.id, { type: 'show_block', blockId: '' })
                }}
                className="text-xs border border-gray-200 rounded px-2 py-1"
              >
                <option value="">Choose action…</option>
                <option value="jump_to_step">Jump to step</option>
                <option value="end_funnel">End funnel</option>
                <option value="hide_block">Hide a block</option>
                <option value="show_block">Show a block</option>
              </select>

              {rule.actions[0]?.type === 'jump_to_step' && (
                <select
                  value={(rule.actions[0] as any).stepId ?? ''}
                  onChange={e => setAction(rule.id, { type: 'jump_to_step', stepId: e.target.value })}
                  className="text-xs border border-gray-200 rounded px-2 py-1"
                >
                  <option value="">Select step…</option>
                  {otherSteps.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                </select>
              )}

              {rule.actions[0]?.type === 'end_funnel' && (
                <select
                  value={(rule.actions[0] as any).outcome ?? 'success'}
                  onChange={e => setAction(rule.id, { type: 'end_funnel', outcome: e.target.value as any })}
                  className="text-xs border border-gray-200 rounded px-2 py-1"
                >
                  <option value="success">Show thank-you message</option>
                  <option value="disqualify">Show disqualification message</option>
                </select>
              )}

              {(rule.actions[0]?.type === 'hide_block' || rule.actions[0]?.type === 'show_block') && (
                <select
                  value={(rule.actions[0] as any).blockId ?? ''}
                  onChange={e => setAction(rule.id, { type: rule.actions[0].type as any, blockId: e.target.value })}
                  className="text-xs border border-gray-200 rounded px-2 py-1"
                >
                  <option value="">Select block…</option>
                  {step.blocks.map(b => <option key={b.id} value={b.id}>{(b as any).config?.label || b.type}</option>)}
                </select>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
