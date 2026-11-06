import { describe, it, expect } from 'vitest'
import { resolveCursor } from '../composables/useCursor'

function element(html: string): Element {
  const host = document.createElement('div')
  host.innerHTML = html
  return host.firstElementChild!.querySelector('[data-target]') ?? host.firstElementChild!
}

describe('resolveCursor', () => {
  it('returns the default variant outside interactive elements', () => {
    expect(resolveCursor(element('<p>text</p>'))).toEqual({ variant: 'default', label: '' })
  })

  it('detects links and buttons', () => {
    expect(resolveCursor(element('<a href="/x">x</a>')).variant).toBe('link')
    expect(resolveCursor(element('<button>x</button>')).variant).toBe('link')
  })

  it('detects text inputs', () => {
    expect(resolveCursor(element('<input />')).variant).toBe('text')
  })

  it('lets data-cursor override the default and carry a label', () => {
    const el = element('<a href="/x" data-cursor="project" data-cursor-label="Ver caso">x</a>')
    expect(resolveCursor(el)).toEqual({ variant: 'project', label: 'Ver caso' })
  })

  it('handles a null target', () => {
    expect(resolveCursor(null).variant).toBe('default')
  })
})
