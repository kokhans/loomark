/** `auto` follows `prefers-color-scheme`. */
export type MermaidTheme = 'auto' | 'light' | 'dark'

/** Options of `renderMermaid()`. */
export type RenderMermaidOptions = {
  /** Defaults to `auto`. */
  theme?: MermaidTheme
  /** Defaults to `pre.mermaid`. */
  selector?: string
}

const DEFAULT_SELECTOR = 'pre.mermaid'

/** Renders the Mermaid diagrams inside `root`, loading Mermaid only when one exists. */
export async function renderMermaid(
  root?: HTMLElement,
  options: RenderMermaidOptions = {},
): Promise<void> {
  if (typeof document === 'undefined') return

  const container = root ?? document.body
  const nodes = Array.from(
    container.querySelectorAll<HTMLElement>(options.selector ?? DEFAULT_SELECTOR),
  )
  if (nodes.length === 0) return

  const { default: mermaid } = await import('mermaid')
  mermaid.initialize({
    startOnLoad: false,
    theme: resolveTheme(options.theme ?? 'auto'),
  })
  await mermaid.run({ nodes })
}

function resolveTheme(theme: MermaidTheme): 'default' | 'dark' {
  if (theme === 'dark') return 'dark'
  if (theme === 'light') return 'default'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'
}
