import { describe, it, expect } from 'vitest'
import { buildRobots, buildSitemap } from '../seo/sitemap'
import { DEFAULT_SITE_URL, normalizeSiteUrl } from '../seo/site'

describe('sitemap', () => {
  it('lists every path under the site URL', () => {
    const xml = buildSitemap('https://example.com', ['/', '/archivo', '/proyectos/a'], '2026-01-01')
    expect(xml).toContain('<loc>https://example.com/</loc>')
    expect(xml).toContain('<loc>https://example.com/archivo</loc>')
    expect(xml).toContain('<loc>https://example.com/proyectos/a</loc>')
    expect(xml.match(/<url>/g)).toHaveLength(3)
    expect(xml).toContain('<lastmod>2026-01-01</lastmod>')
  })

  it('escapes XML special characters', () => {
    expect(buildSitemap('https://example.com', ['/a&b'], '2026-01-01')).toContain('/a&amp;b')
  })

  it('points robots.txt at the sitemap', () => {
    expect(buildRobots('https://example.com')).toContain('Sitemap: https://example.com/sitemap.xml')
  })
})

describe('normalizeSiteUrl', () => {
  it('falls back to the default and trims trailing slashes', () => {
    expect(normalizeSiteUrl(undefined)).toBe(DEFAULT_SITE_URL)
    expect(normalizeSiteUrl('  ')).toBe(DEFAULT_SITE_URL)
    expect(normalizeSiteUrl('https://juan.dev//')).toBe('https://juan.dev')
  })
})
