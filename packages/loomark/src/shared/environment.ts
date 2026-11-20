/** Whether `NODE_ENV` is `production`. */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}
