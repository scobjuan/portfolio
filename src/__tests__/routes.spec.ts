import { describe, it, expect } from 'vitest'
import { routes, SECTIONS, getSection, getSectionByPath } from '../router/routes'

describe('routes', () => {
  it('defines one route per home section', () => {
    const sections = routes.map((route) => route.meta?.section).filter(Boolean)
    expect(sections).toEqual(SECTIONS.map((section) => section.id))
  })

  it('maps the home section to the root path', () => {
    expect(routes.find((route) => route.meta?.section === 'home')?.path).toBe('/')
  })

  it('keeps public URLs in Spanish', () => {
    const paths = SECTIONS.map((section) => section.path)
    expect(paths).toContain('/sobre-mi')
    expect(paths).toContain('/habilidades')
  })

  it('resolves sections by id and by path', () => {
    expect(getSection('about')?.path).toBe('/sobre-mi')
    expect(getSectionByPath('/contacto')?.id).toBe('contact')
    expect(getSection('missing')).toBeUndefined()
  })

  it('gives every section a unique id and path', () => {
    expect(new Set(SECTIONS.map((s) => s.id)).size).toBe(SECTIONS.length)
    expect(new Set(SECTIONS.map((s) => s.path)).size).toBe(SECTIONS.length)
  })
})
