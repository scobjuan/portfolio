import gsap from 'gsap'

const GLYPHS = '!<>-_\\/[]{}=+*^?#%&'

/**
 * Text for one frame of a scramble effect: characters before `progress`
 * (0 to 1) are already final, the rest are random glyphs. Spaces are kept.
 */
export function scrambleFrame(
  text: string,
  progress: number,
  random: () => number = Math.random,
): string {
  const revealed = Math.floor(text.length * Math.min(Math.max(progress, 0), 1))
  let out = ''
  for (let i = 0; i < text.length; i += 1) {
    const char = text.charAt(i)
    out += i < revealed || char === ' ' ? char : GLYPHS.charAt(Math.floor(random() * GLYPHS.length))
  }
  return out
}

/** Animates `el.textContent` from random glyphs to `text`. */
export function scrambleText(el: HTMLElement, text: string, duration = 0.9): gsap.core.Tween {
  const state = { progress: 0 }
  return gsap.to(state, {
    progress: 1,
    duration,
    ease: 'none',
    onUpdate: () => {
      el.textContent = scrambleFrame(text, state.progress)
    },
    onComplete: () => {
      el.textContent = text
    },
  })
}

/** Formats a counter value, e.g. `formatCount(5, '+')` gives `5+`. */
export function formatCount(value: number, suffix = ''): string {
  return `${Math.round(value)}${suffix}`
}

/** Counts `el` up from 0 to `value`. */
export function countUp(el: HTMLElement, value: number, suffix = '', vars: gsap.TweenVars = {}) {
  const state = { value: 0 }
  return gsap.to(state, {
    value,
    duration: 1.4,
    ease: 'expo.out',
    ...vars,
    onUpdate: () => {
      el.textContent = formatCount(state.value, suffix)
    },
  })
}
