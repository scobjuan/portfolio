function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** `sitemap.xml` for the given absolute site URL and paths such as `/archivo`. */
export function buildSitemap(siteUrl: string, paths: string[], lastmod: string): string {
  const urls = paths
    .map(
      (path) =>
        `  <url>\n    <loc>${escapeXml(siteUrl + (path === '/' ? '/' : path))}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function buildRobots(siteUrl: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
}
