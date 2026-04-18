import { nanoid } from 'nanoid'

export function genId(prefix?: string): string {
  const id = nanoid(10)
  return prefix ? `${prefix}_${id}` : id
}
