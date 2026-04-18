import type { FunnelStep } from '../types/funnel'
import type { Block } from '../types/blocks'
import { isFormField } from '../types/blocks'

export interface ValidationError {
  fieldId: string
  fieldName: string
  message: string
}

export function validateStep(
  step: FunnelStep,
  formValues: Record<string, unknown>,
  hiddenBlocks: Set<string>
): ValidationError[] {
  const errors: ValidationError[] = []

  for (const block of step.blocks) {
    if (hiddenBlocks.has(block.id) || block.hidden) continue
    if (!isFormField(block.type)) continue

    const cfg = (block as any).config
    if (!cfg?.required) continue

    const fn = cfg.fieldName || block.id
    const val = formValues[fn]
    const isEmpty =
      val === undefined ||
      val === null ||
      val === '' ||
      (Array.isArray(val) && val.length === 0)

    if (isEmpty) {
      errors.push({
        fieldId: block.id,
        fieldName: fn,
        message: cfg.label ? `${cfg.label} is required` : 'This field is required',
      })
    }
  }

  return errors
}
