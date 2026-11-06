import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
let tick: ((time: number) => void) | null = null
let locks = 0

/** Starts smooth scrolling, synced with GSAP. Skipped with reduced motion. */
export function initLenis(): Lenis | null {
  if (lenis || typeof window === 'undefined' || prefersReducedMotion()) return lenis

  lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)

  tick = (time) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  if (locks > 0) lenis.stop()
  // Webfonts change layout; recompute scroll triggers once they are in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh())
  return lenis
}

export function destroyLenis() {
  if (tick) gsap.ticker.remove(tick)
  lenis?.destroy()
  lenis = null
  tick = null
}

export function getLenis(): Lenis | null {
  return lenis
}

/** Blocks scrolling (loader, mobile menu). Calls are counted; pair with `unlockScroll`. */
export function lockScroll() {
  locks += 1
  document.documentElement.classList.add('is-scroll-locked')
  lenis?.stop()
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks > 0) return
  document.documentElement.classList.remove('is-scroll-locked')
  lenis?.start()
}

interface ScrollOptions {
  immediate?: boolean
  onComplete?: () => void
}

/** Scrolls to an element with Lenis, or natively when Lenis is off. */
export function scrollToElement(
  el: HTMLElement,
  { immediate = false, onComplete }: ScrollOptions = {},
) {
  if (lenis) {
    lenis.scrollTo(el, {
      immediate,
      force: true,
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      onComplete,
    })
    return
  }

  window.scrollTo({ top: el.offsetTop, behavior: 'auto' })
  onComplete?.()
}
