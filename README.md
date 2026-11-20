# Loomark

Loomark is a build-time data library for Next.js 16, React Router v8 and TanStack Start that
compiles Markdown collections into searchable, filterable, sortable and SEO-friendly content for
blogs and docs.

Usage documentation lives in the package README: [packages/loomark/README.md](packages/loomark/README.md).

## Repository Layout

- `packages/loomark`: the published `loomark` package. Source in `src/`, tests in `test/`. Type
  tests live in `test/*.test-d.ts`.
- `examples/next`: Next.js App Router example.
- `examples/react-router`: React Router v8 framework mode example.
- `examples/tanstack-start`: TanStack Start example.

## Requirements

- Node.js 22 or newer
- pnpm (version pinned in `packageManager` of the root `package.json`)

## Development

```bash
pnpm install
pnpm build            # build the library with tsdown
pnpm test             # run the vitest suite, including type tests
pnpm typecheck        # tsc on the library source and tests
pnpm lint             # eslint with typescript-eslint strict rules
pnpm format:check     # prettier
pnpm build:examples   # build all example apps
```

`pnpm build` runs two tsdown builds into `dist/`: the build-time entries (`loomark`, `loomark/next`,
`loomark/vite` and the `loomark` CLI in `src/cli`) for Node, and the runtime entries
(`loomark/query`, `loomark/search`, `loomark/mermaid`, `loomark/seo`) for a neutral platform,
because they ship to the browser. Keep Node APIs and build-time dependencies out of the runtime
entries.

`pnpm test` also type checks `test/*.test-d.ts` through Vitest typecheck mode, so a type regression
fails the suite like any other test.

pnpm links the `loomark` binary into the examples at install time, so after the first `pnpm build`
run `pnpm install` once to use `pnpm exec loomark` there.

The monorepo is pnpm specific (`pnpm-workspace.yaml` and the `workspace:*` protocol in the
examples). The published package works with any package manager.

## Continuous Integration

`.github/workflows/ci.yml` runs on every pull request and every push to `main`, on Node 22 and
24: `pnpm install --frozen-lockfile`, `lint`, `format:check`, `typecheck`, `test`, `build` and
`build:examples`, in that order. Node 22 is the lowest version in `engines`, so a change that
needs a newer Node fails there first. Run the same commands locally before pushing.

## Examples

All example apps render the same blog from the same content folder:

- `examples/next`: Next.js App Router, `generateStaticParams`, `@tailwindcss/postcss`
- `examples/react-router`: React Router v8 framework mode, `prerender`, `@tailwindcss/vite`
- `examples/tanstack-start`: TanStack Start with file routes, `prerender`, `@tailwindcss/vite`

Each one has a post list with pagination, tag filters and search, a post page with table of
contents, prev/next links, related posts, JSON-LD and Mermaid diagrams, plus a client-side search
page, `sitemap.xml` and `rss.xml`.

## Releasing

Every release is made from the GitHub Releases page. The tag decides the version, and
`.github/workflows/release.yml` publishes the package to npm.

1. On GitHub, open **Releases** and click **Draft a new release**.
2. Type a new tag such as `v1.2.4` and pick `main` as the target.
3. Click **Generate release notes**. GitHub lists the pull requests merged since the last release.
   Edit the text if needed.
4. Click **Publish release**.

The workflow then:

- reads the version from the tag, so `v1.2.4` publishes `loomark@1.2.4`. Tags without a valid
  version fail.
- runs `lint`, `format:check`, `typecheck` and `test`, and stops before publishing if one fails.
- sets the version in `packages/loomark/package.json` for the upload only. Nothing is committed, so
  the version in the repository is not the released one.
- publishes with `npm publish`. `prepublishOnly` builds `dist/` first.
- publishes a pre-release such as `v1.3.0-beta.1` under the npm tag `next`, so
  `npm install loomark` keeps installing the latest stable version.
- skips publishing when that version is already on npm, so a release can be re-run safely.

The release notes on the Releases page are the changelog, and the package README links to them.

### One-Time npm Setup

The workflow publishes with
[npm trusted publishing](https://docs.npmjs.com/trusted-publishers): npm checks that the upload
comes from this repository and this workflow, so no npm token is stored anywhere, and npm adds
provenance to every version.

1. Publish the first version by hand, because npm can only connect a package that exists:

   ```bash
   npm login
   cd packages/loomark
   npm publish --access public
   ```

   This publishes the version in `package.json`, currently `0.1.0`.

2. On npmjs.com, open the `loomark` package, then **Settings**, then **Trusted Publisher**. Choose
   **GitHub Actions** and enter the owner `kokhans`, the repository `loomark` and the workflow file
   `release.yml`.
3. In the same settings, require two-factor authentication and disallow tokens for publishing, so
   the workflow is the only way to publish.
4. Create the `v0.1.0` release on GitHub for the release notes. The workflow skips the publish,
   because `0.1.0` is already on npm.

### License File

npm only packs files from `packages/loomark`, so `packages/loomark/LICENSE` is a copy of the root
`LICENSE`. Keep both in sync.
