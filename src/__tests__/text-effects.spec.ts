import { describe, it, expect } from 'vitest'
import { formatCount, scrambleFrame } from '../utils/text-effects'

describe('scrambleFrame', () => {
  const fixed = () => 0

  it('is fully scrambled at progress 0, keeping spaces and length', () => {
    const out = scrambleFrame('Hola mundo', 0, fixed)
    expect(out).toHaveLength(10)
    expect(out[4]).toBe(' ')
    expect(out.replace(' ', '')).not.toMatch(/[a-z]/i)
  })

  it('reveals characters from the left as progress grows', () => {
    expect(scrambleFrame('Hola', 0.5, fixed).startsWith('Ho')).toBe(true)
    expect(scrambleFrame('Hola', 0.5, fixed).slice(2)).not.toContain('l')
  })

  it('returns the final text at progress 1 and clamps out-of-range values', () => {
    expect(scrambleFrame('Hola', 1, fixed)).toBe('Hola')
    expect(scrambleFrame('Hola', 5, fixed)).toBe('Hola')
    expect(scrambleFrame('Hola', -1, fixed)).toHaveLength(4)
  })
})

describe('formatCount', () => {
  it('rounds and appends the suffix', () => {
    expect(formatCount(4.6, '+')).toBe('5+')
    expect(formatCount(24)).toBe('24')
  })
})
