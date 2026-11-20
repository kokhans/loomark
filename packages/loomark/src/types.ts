import type {
  BundledLanguage,
  BundledTheme,
  LanguageRegistration,
  ThemeRegistrationAny,
} from 'shiki'
import type { PluggableList } from 'unified'
import type { z } from 'zod'

/** Frontmatter fields of an entry. */
export type EntryFields = Record<string, unknown>

/** A heading in the table of contents of an entry. */
export type TocItem = {
  /** Heading level, from 1 to 4. */
  depth: number
  text: string
  /** Anchor id of the heading. */
  id: string
}

/** Fields that Loomark adds to every entry. */
export type EntryMeta = {
  /** Path inside the collection folder without `.md`, or the `slug` frontmatter field. */
  slug: string
  /** Result of the collection `url()` function. */
  url: string
  collection: string
  /** Markdown file relative to the project root. */
  filePath: string
  /** Rendered HTML of the body. */
  html: string
  /** Markdown body without frontmatter. */
  body: string
  /** The `excerpt` frontmatter field, or the start of the first paragraph. */
  excerpt: string
  toc: TocItem[]
  /** Minutes at 200 words per minute. */
  readingTime: number
  /** Prose words, without code blocks or HTML. */
  wordCount: number
  /** Whether the body contains a Mermaid diagram. */
  hasMermaid: boolean
}

/** A content entry: its frontmatter fields plus {@link EntryMeta}. */
export type Entry<T = EntryFields> = T & EntryMeta

/** Ascending or descending. */
export type SortDirection = 'asc' | 'desc'

/** Sort order by field, such as `{ date: 'desc' }`. */
export type SortOption = Record<string, SortDirection>

/** Search index settings of a collection. */
export type SearchOption = {
  /** Fields to index. */
  fields: string[]
  /** Score multiplier per field, such as `{ title: 3 }`. */
  boost?: Record<string, number>
}

/** Settings of a collection that has its own RSS feed. */
export type RssFeedOptions = {
  /** Feed file name. Defaults to `<collection>.xml`. */
  file?: string
  /** Defaults to the config `title`. */
  title?: string
  /** Defaults to the config `description`. */
  description?: string
}

/** Options of `collection()`. */
export type CollectionOptions<S extends z.ZodType> = {
  /** Folder inside `contentDir`. */
  folder: string
  /** Zod schema for the frontmatter. */
  schema: S
  /** Returns the URL of an entry. */
  url: (entry: Entry<z.output<S>>) => string
  /** Default sort order. */
  sort?: SortOption
  /** Enables `<collection>.search.json`. */
  search?: SearchOption
  /** `true` adds the collection to `rss.xml`. An object gives it its own feed. */
  rss?: boolean | RssFeedOptions
  /** Adds the collection to `sitemap.xml`. Defaults to `true`. */
  sitemap?: boolean
  /** Default page size of `query()`. Defaults to 10. */
  perPage?: number
}

/** A collection returned by `collection()`. */
export type CollectionDefinition<S extends z.ZodType> = CollectionOptions<S>

/** A collection with its schema type erased, as stored in the config. */
export type RuntimeCollection = {
  folder: string
  schema: z.ZodType
  url: (entry: never) => string
  sort?: SortOption
  search?: SearchOption
  rss?: boolean | RssFeedOptions
  sitemap?: boolean
  perPage?: number
}

/** A bundled Shiki theme name or a theme object. */
export type ShikiTheme = BundledTheme | ThemeRegistrationAny

/** Options of the Markdown pipeline. */
export type MarkdownOptions = {
  /** Remark plugins, run after GitHub Flavored Markdown. */
  remarkPlugins?: PluggableList
  /** Rehype plugins, run before code blocks are highlighted. */
  rehypePlugins?: PluggableList
  shiki?: {
    /** Defaults to `github-light` and `github-dark`. */
    themes?: { light: ShikiTheme; dark: ShikiTheme }
    /** Languages Shiki does not bundle. Bundled ones load on demand. */
    langs?: (BundledLanguage | LanguageRegistration)[]
  }
}

/** Options of `defineConfig()`. */
export type LoomarkConfig = {
  /** Absolute site URL. Required for the sitemap and RSS feeds. */
  siteUrl?: string
  /** Feed title. Defaults to `'Blog'`. */
  title?: string
  /** Feed description. */
  description?: string
  /** Folder of the collections. Defaults to `content`. */
  contentDir?: string
  /** Folder of the generated output. Defaults to `.loomark`. */
  outDir?: string
  /** Folder that receives copies of the feeds and images. */
  publicDir?: string
  /** Folder inside `publicDir` for images. Defaults to `loomark`. */
  assetsDir?: string
  markdown?: MarkdownOptions
  /** Collections keyed by name. Names become exports of `.loomark/index.js`. */
  collections: Record<string, RuntimeCollection>
}

/** A content problem found by the build. */
export type ValidationError = {
  /** Markdown file relative to the project root. */
  file: string
  collection: string
  /** Frontmatter field, `body` or `slug`. */
  field: string
  message: string
}

/** Development keeps drafts and logs errors. Production drops drafts and fails on errors. */
export type BuildMode = 'development' | 'production'

/** Options of `build()`. */
export type BuildOptions = {
  /** Project root. Defaults to `process.cwd()`. */
  cwd?: string
  /** Inline config used instead of the config file. */
  config?: LoomarkConfig
  /** Config file relative to `cwd`. Defaults to `loomark.config.ts`. */
  configFile?: string
  /** Defaults to `production` when `NODE_ENV` is `production`. */
  mode?: BuildMode
}

/** Result of `build()`. */
export type BuildResult = {
  /** Published entries keyed by collection. */
  entries: Record<string, Entry[]>
  errors: ValidationError[]
}

/** A config with its folders resolved to absolute paths. */
export type Project = {
  cwd: string
  config: LoomarkConfig
  configFile: string | undefined
  contentDir: string
  outDir: string
  publicDir: string | undefined
}

/** The entry type of a collection, inferred from its schema. */
export type EntryOf<C> = C extends { schema: infer S }
  ? S extends z.ZodType
    ? Entry<z.output<S>>
    : Entry
  : Entry
