export interface TextSegment {
  text: string
  highlight: boolean
}

/**
 * Splits `text` into segments, marking the ones that match any of `terms`
 * (case-sensitive, first occurrence order). Keeps copy in the content files
 * while letting a component style the keywords without `v-html`.
 */
export function highlightSegments(text: string, terms: readonly string[]): TextSegment[] {
  const found = terms.filter(Boolean)
  if (!found.length) return [{ text, highlight: false }]

  // Longest terms first so "Arch + dwm" wins over a shorter overlapping term.
  const escaped = [...found]
    .sort((a, b) => b.length - a.length)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const pattern = new RegExp(`(${escaped.join('|')})`, 'g')

  return text
    .split(pattern)
    .filter((part) => part !== '')
    .map((part) => ({ text: part, highlight: found.includes(part) }))
}
