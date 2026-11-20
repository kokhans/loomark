import { compareValues, readField } from './values.js'

/** Sort direction by field. */
export type SortSpec = Record<string, string>

/** Returns the entries sorted by the given fields, in order. */
export function sortEntries<T extends object>(
  entries: readonly T[],
  sort: SortSpec | undefined,
): T[] {
  const spec = Object.entries(sort ?? {})
  if (spec.length === 0) return [...entries]

  return [...entries].sort((left, right) => {
    for (const [field, direction] of spec) {
      const order = compareValues(readField(left, field), readField(right, field))
      if (order !== 0) return direction === 'desc' ? -order : order
    }
    return 0
  })
}
