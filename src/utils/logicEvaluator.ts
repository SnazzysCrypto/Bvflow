import type { LogicRule, LogicCondition, LogicAction } from '../types/funnel'

export interface EvalResult {
  hiddenBlocks: Set<string>
  nextStepId: string | null
  endFunnel: boolean
  endOutcome: 'success' | 'disqualify' | null
}

function testCondition(cond: LogicCondition, formValues: Record<string, unknown>): boolean {
  const rawVal = formValues[cond.sourceFieldId]
  const sv = rawVal !== undefined && rawVal !== null ? String(rawVal) : ''
  const cv = cond.value !== null && cond.value !== undefined ? String(cond.value) : ''

  switch (cond.operator) {
    case 'equals': return sv === cv
    case 'not_equals': return sv !== cv
    case 'contains': return sv.toLowerCase().includes(cv.toLowerCase())
    case 'not_contains': return !sv.toLowerCase().includes(cv.toLowerCase())
    case 'starts_with': return sv.toLowerCase().startsWith(cv.toLowerCase())
    case 'ends_with': return sv.toLowerCase().endsWith(cv.toLowerCase())
    case 'greater_than': return parseFloat(sv) > parseFloat(cv)
    case 'less_than': return parseFloat(sv) < parseFloat(cv)
    case 'is_empty': return !sv || sv.trim() === ''
    case 'is_not_empty': return !!(sv && sv.trim() !== '')
    case 'is_checked': return sv === 'true' || sv === '1' || sv === 'yes'
    case 'is_not_checked': return sv !== 'true' && sv !== '1' && sv !== 'yes'
    default: return false
  }
}

export function evaluateLogicRules(
  rules: LogicRule[],
  formValues: Record<string, unknown>
): EvalResult {
  const result: EvalResult = {
    hiddenBlocks: new Set(),
    nextStepId: null,
    endFunnel: false,
    endOutcome: null,
  }

  for (const rule of rules) {
    if (!rule.enabled) continue
    if (rule.conditions.length === 0) continue

    const match = rule.conditionOperator === 'OR'
      ? rule.conditions.some(c => testCondition(c, formValues))
      : rule.conditions.every(c => testCondition(c, formValues))

    if (!match) continue

    for (const action of rule.actions) {
      applyAction(action, result)
    }
  }

  return result
}

function applyAction(action: LogicAction, result: EvalResult): void {
  switch (action.type) {
    case 'jump_to_step':
      result.nextStepId = action.stepId
      break
    case 'hide_block':
      result.hiddenBlocks.add(action.blockId)
      break
    case 'show_block':
      result.hiddenBlocks.delete(action.blockId)
      break
    case 'end_funnel':
      result.endFunnel = true
      result.endOutcome = action.outcome
      break
  }
}
