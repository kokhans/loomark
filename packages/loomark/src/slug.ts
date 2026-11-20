import path from 'node:path'

/** Returns the slug of a Markdown file from its path. */
export function slugFromFile(contentDir: string, filePath: string): string {
  const relative = path.relative(contentDir, filePath)
  const withoutExtension = relative.slice(0, -path.extname(relative).length)
  return withoutExtension.split(path.sep).join('/')
}
