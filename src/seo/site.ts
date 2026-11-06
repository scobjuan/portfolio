/** Used until the real domain is configured through the `VITE_SITE_URL` environment variable. */
export const DEFAULT_SITE_URL = 'https://juanescobar.example.com'

export function normalizeSiteUrl(url: string | undefined): string {
  return (url?.trim() || DEFAULT_SITE_URL).replace(/\/+$/, '')
}
