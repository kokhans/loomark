/** Escapes text for XML. */
export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

/** Joins a site URL and a path with exactly one slash. */
export function joinUrl(siteUrl: string, url: string): string {
  return `${siteUrl.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}`
}
