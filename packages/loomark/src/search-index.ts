import { readField } from './shared/values.js'
import type { Entry, RuntimeCollection } from './types.js'

/** One entry in the search index. */
export type SearchDocument = {
  id: string
  url: string
  [field: string]: unknown
}

/** Serialized search index of a collection. */
export type SearchIndex = {
  fields: string[]
  boost: Record<string, number>
  documents: SearchDocument[]
}

/** Builds the search index of a collection. */
export function createSearchIndex(definition: RuntimeCollection, entries: Entry[]): SearchIndex {
  const fields = definition.search?.fields ?? []

  return {
    fields,
    boost: definition.search?.boost ?? {},
    documents: entries.map((entry) => {
      const document: SearchDocument = { id: entry.slug, url: entry.url }
      for (const field of fields) {
        document[field] = readField(entry, field)
      }
      return document
    }),
  }
}
