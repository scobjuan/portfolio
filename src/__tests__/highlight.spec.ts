import { describe, expect, it } from 'vitest'
import { highlightSegments } from '@/utils/highlight'

describe('highlightSegments', () => {
  it('marks every matching term and keeps the text in between', () => {
    expect(highlightSegments('Uso Vue 3 y Arch + dwm.', ['Vue 3', 'Arch + dwm'])).toEqual([
      { text: 'Uso ', highlight: false },
      { text: 'Vue 3', highlight: true },
      { text: ' y ', highlight: false },
      { text: 'Arch + dwm', highlight: true },
      { text: '.', highlight: false },
    ])
  })

  it('returns the whole text when there are no terms or no matches', () => {
    expect(highlightSegments('Hola', [])).toEqual([{ text: 'Hola', highlight: false }])
    expect(highlightSegments('Hola', ['Vue'])).toEqual([{ text: 'Hola', highlight: false }])
  })

  it('escapes regular expression characters in terms', () => {
    expect(highlightSegments('C++ y C', ['C++'])).toEqual([
      { text: 'C++', highlight: true },
      { text: ' y C', highlight: false },
    ])
  })

  it('reassembles to the original text', () => {
    const text = 'JavaScript, Vim hasta en VSCode.'
    const joined = highlightSegments(text, ['JavaScript', 'VSCode'])
      .map((segment) => segment.text)
      .join('')
    expect(joined).toBe(text)
  })
})
