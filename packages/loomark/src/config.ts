import { z } from 'zod'
import type { CollectionDefinition, CollectionOptions, LoomarkConfig } from './types.js'

export { z }

/** Defines a collection and infers its entry type from the schema. */
export function collection<S extends z.ZodType>(
  options: CollectionOptions<S>,
): CollectionDefinition<S> {
  return options
}

/** Defines the Loomark config. */
export function defineConfig<C extends LoomarkConfig>(config: C): C {
  return config
}
