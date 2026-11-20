# Agents

Loomark is a build-time data library for Next.js 16, React Router v8 and TanStack Start that
compiles Markdown collections into searchable, filterable, sortable and SEO-friendly content for
blogs and docs. It turns Markdown files with YAML frontmatter into typed JSON collections, a
search index, `sitemap.xml` and `rss.xml` inside `.loomark/`.

## Layout

- `packages/loomark`: the library. Source in `src/`, tests in `test/`.
- `src/build.ts`: entry point of the build pipeline.
- `src/query`, `src/search`, `src/mermaid`, `src/seo`: runtime entries, shipped to the browser.
- `src/next`, `src/vite`: framework integrations.
- `examples/next`, `examples/react-router`, `examples/tanstack-start`: example apps rendering the
  same content.

## Commands

```bash
pnpm install
pnpm build            # build the library
pnpm test             # run vitest
pnpm typecheck        # tsc
pnpm lint             # eslint
pnpm format:check     # prettier
pnpm build:examples   # build all example apps
```

## Rules

- Node 22+, ESM only, pnpm workspace.
- Keep runtime entries small and free of build-time dependencies.
- Prettier style: no semicolons, single quotes, 100 character lines.
- Add or update tests in `packages/loomark/test` for behavior changes.
- Usage docs live in `packages/loomark/README.md`, development docs in the root `README.md`.
- Keep `packages/loomark/README.md` in sync with public API changes.

## Comments and Descriptions

- Write no comments: no line, block or end-of-line comments in code, configs or workflows. Make
  the code explain itself with clear names and small functions. Name workflow steps with `name:`.
- Give every exported function, type and constant a one-line JSDoc description (`/** ... */`).
- Describe public option and result fields with one line when the name is not enough. State
  defaults as `Defaults to ...`.
- Keep descriptions short and plain: one sentence in present tense that says what it is or does,
  not how it works. Do not start with "This function".
- Allowed tool comments: the CLI shebang, `@ts-expect-error` in type tests and `eslint-disable`
  with a reason.

## Markdown Conventions

- Never use double dashes (`--` or `—`) in prose.
- Headers and subheaders use Title Case.
