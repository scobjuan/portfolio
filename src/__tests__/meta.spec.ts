import { describe, it, expect } from 'vitest'
import { getRouteLabel, getRouteTheme, getViewKey } from '../router/meta'
import { getNextProject, projects, featuredProjects } from '../content/projects'

const route = (path: string, meta = {}, params = {}) => ({ path, meta, params })

describe('route meta helpers', () => {
  it('uses the section theme and label for home sections', () => {
    const about = route('/sobre-mi', { section: 'about' })
    expect(getRouteTheme(about as never)).toBe('bone')
    expect(getRouteLabel(about as never)).toBe('Sobre mí')
  })

  it('uses the explicit theme for other views', () => {
    expect(getRouteTheme(route('/archivo', { theme: 'graphite' }) as never)).toBe('graphite')
    expect(getRouteLabel(route('/archivo') as never)).toBe('Archivo')
  })

  it('labels project pages with the project title', () => {
    const page = route('/proyectos/tienda-headless', {}, { slug: 'tienda-headless' })
    expect(getRouteLabel(page as never)).toBe('Tienda headless')
  })

  it('shares one view key across home sections but not across pages', () => {
    expect(getViewKey(route('/contacto', { section: 'contact' }) as never)).toBe('home')
    expect(getViewKey(route('/proyectos', { section: 'projects' }) as never)).toBe('home')
    expect(getViewKey(route('/proyectos/a') as never)).not.toBe(
      getViewKey(route('/proyectos/b') as never),
    )
  })
})

describe('project content', () => {
  it('wraps around when asking for the next project', () => {
    const last = projects[projects.length - 1]!
    expect(getNextProject(last.slug)?.slug).toBe(projects[0]!.slug)
    expect(getNextProject('missing')).toBeUndefined()
  })

  it('features a subset of the archive and keeps slugs unique', () => {
    expect(featuredProjects.length).toBeGreaterThan(0)
    expect(featuredProjects.length).toBeLessThan(projects.length)
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length)
  })
})
