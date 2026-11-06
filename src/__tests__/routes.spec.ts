import { describe, it, expect } from 'vitest'
import { routes, SECTIONS } from '../router/routes'

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
})
