import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { isInside } from './assets.js'
import { isRecord } from './shared/values.js'

/** Name of the manifest in the output folder. */
export const MANIFEST_FILE = '.manifest.json'

/** Files written by a build, used to remove stale files on the next one. */
export type Manifest = {
  outFiles: string[]
  publicDir?: string
  publicFiles: string[]
}

/** Reads the manifest of the previous build. */
export async function readManifest(outDir: string): Promise<Manifest | undefined> {
  const source = await readFile(path.join(outDir, MANIFEST_FILE), 'utf8').catch(() => undefined)
  if (source === undefined) return undefined

  try {
    const value: unknown = JSON.parse(source)
    if (!isRecord(value)) return undefined
    const { outFiles, publicDir, publicFiles } = value
    if (!isStringList(outFiles) || !isStringList(publicFiles)) return undefined
    if (publicDir !== undefined && typeof publicDir !== 'string') return undefined
    return { outFiles, publicFiles, ...(publicDir === undefined ? {} : { publicDir }) }
  } catch {
    return undefined
  }
}

/** Writes the manifest of the current build. */
export async function writeManifest(outDir: string, manifest: Manifest): Promise<void> {
  await writeFile(path.join(outDir, MANIFEST_FILE), `${JSON.stringify(manifest, null, 2)}\n`)
}

/** Removes files the previous build wrote and the current one did not. */
export async function removeStaleFiles(
  cwd: string,
  outDir: string,
  previous: Manifest | undefined,
  current: Manifest,
): Promise<void> {
  if (!previous) return

  await removeMissing(outDir, previous.outFiles, current.outFiles)

  if (previous.publicDir !== undefined) {
    const publicDir = path.resolve(cwd, previous.publicDir)
    if (!isInside(cwd, publicDir)) return
    const kept = previous.publicDir === current.publicDir ? current.publicFiles : []
    await removeMissing(publicDir, previous.publicFiles, kept)
  }
}

async function removeMissing(folder: string, before: string[], after: string[]): Promise<void> {
  const keep = new Set(after)
  const stale = before
    .filter((file) => !keep.has(file))
    .map((file) => path.resolve(folder, file))
    .filter((file) => file !== folder && isInside(folder, file))
  await Promise.all(stale.map((file) => rm(file, { force: true })))
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}
