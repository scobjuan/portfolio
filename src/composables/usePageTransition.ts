import { computed, reactive, watch } from 'vue'
import gsap from 'gsap'
import { lockScroll, unlockScroll, getLenis } from './useLenis'
import { useCursor } from './useCursor'
import { useLoader } from './useLoader'
import { prefersReducedMotion } from './useReducedMotion'
import { scrambleText } from '@/utils/text-effects'
import type { ThemeId } from '@/router/routes'

/**
 * "Recompile" page transition (about 1.2 s):
 *  1. 0-250 ms     the current page sinks and dims, the cursor shrinks to a dot
 *  2. 250-600 ms   a curtain in the destination colour rises with a curved edge
 *  3. 600-850 ms   covered: the route name scrambles in and the new view mounts
 *  4. 850-1200 ms  the curtain leaves upward while the new page's titles enter
 * With reduced motion it is a 200 ms cross-fade.
 */

export interface CurtainElements {
  root: HTMLElement
  panel: HTMLElement
  label: HTMLElement
  sub: HTMLElement
}

export interface Destination {
  theme: ThemeId
  label: string
  path: string
}

const state = reactive({ active: false, revealing: false })
const cursor = useCursor()
let curtain: CurtainElements | null = null
let timeline: gsap.core.Timeline | null = null
let scrambling: gsap.core.Tween | null = null
let scrollLocked = false

const THEME_COLORS: Record<ThemeId, { bg: string; fg: string }> = {
  ink: { bg: '--color-ink', fg: '--color-bone' },
  graphite: { bg: '--color-graphite', fg: '--color-bone' },
  bone: { bg: '--color-bone', fg: '--color-ink' },
  cobalt: { bg: '--color-cobalt', fg: '--color-bone' },
  lime: { bg: '--color-lime', fg: '--color-ink' },
}

const read = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim()

/** Curtain colours: the destination's atmosphere, or lime when it matches the current page. */
function curtainColors(destination: ThemeId) {
  const current = (document.body.dataset.theme ?? 'ink') as ThemeId
  const theme = destination === current ? 'lime' : destination
  const { bg, fg } = THEME_COLORS[theme]
  return { bg: read(bg), fg: read(fg) }
}

export function registerCurtain(elements: CurtainElements | null) {
  curtain = elements
}

function scrollToTop() {
  getLenis()?.scrollTo(0, { immediate: true, force: true })
  window.scrollTo(0, 0)
}

function finish() {
  state.active = false
  state.revealing = false
  cursor.locked = false
  cursor.variant = 'default'
  document.documentElement.classList.remove('is-page-transition')
  if (scrollLocked) unlockScroll()
  scrollLocked = false
  if (curtain) gsap.set(curtain.root, { autoAlpha: 0 })
}

/** Called when the outgoing view starts leaving. Calls `done` once the screen is covered. */
export function leavePage(el: Element, done: () => void, destination: Destination) {
  cancelPageTransition()
  state.active = true
  state.revealing = false

  if (prefersReducedMotion() || !curtain) {
    gsap.to(el, { opacity: 0, duration: 0.1, onComplete: () => (scrollToTop(), done()) })
    return
  }

  const { root, panel, label, sub } = curtain
  const { bg, fg } = curtainColors(destination.theme)
  const radius = window.innerHeight * 0.15

  document.documentElement.classList.add('is-page-transition')
  lockScroll()
  scrollLocked = true
  cursor.locked = true
  cursor.variant = 'dot'

  gsap.set(root, { autoAlpha: 1 })
  gsap.set(panel, { backgroundColor: bg, yPercent: 100, '--rt': `${radius}px`, '--rb': '0px' })
  gsap.set([label, sub], { autoAlpha: 0, color: fg })
  label.textContent = ''
  sub.textContent = destination.path

  timeline = gsap
    .timeline({ defaults: { ease: 'power4.inOut' } })
    .to(el, { y: 40, opacity: 0.4, duration: 0.25, ease: 'power2.in' }, 0)
    .to(panel, { yPercent: 0, '--rt': '0px', duration: 0.35 }, 0.25)
    .set(sub, { autoAlpha: 1 }, 0.45)
    .call(
      () => {
        gsap.set(label, { autoAlpha: 1 })
        scrambling = scrambleText(label, destination.label, 0.4)
      },
      undefined,
      0.45,
    )
    .call(() => (scrollToTop(), done()), undefined, 0.6)
}

/** Called once the incoming view is mounted: holds the cover briefly, then reveals it. */
export function enterPage(el: Element, done: () => void) {
  if (prefersReducedMotion() || !curtain || !state.active) {
    state.revealing = true
    gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: 0.1, onComplete: () => (finish(), done()) },
    )
    return
  }

  const { panel, label, sub } = curtain
  const radius = window.innerHeight * 0.15

  gsap.set(el, { clearProps: 'all' })
  timeline = gsap
    .timeline({ defaults: { ease: 'power4.inOut' } })
    .call(() => void (state.revealing = true), undefined, 0.25)
    .set(panel, { '--rb': '0px' }, 0.25)
    .to(panel, { yPercent: -100, '--rb': `${radius}px`, duration: 0.35 }, 0.25)
    .to([label, sub], { autoAlpha: 0, duration: 0.2, ease: 'power2.out' }, 0.25)
    .call(() => (finish(), done()), undefined, 0.62)
}

export function cancelPageTransition() {
  timeline?.kill()
  scrambling?.kill()
  timeline = null
  scrambling = null
  if (state.active) finish()
}

export function usePageTransition() {
  return state
}

/** `true` once the page is on screen: loader gone and any transition curtain lifting. */
export function usePageReady() {
  const loader = useLoader()
  return computed(() => loader.done && (!state.active || state.revealing))
}

/** Runs `callback` once, as soon as the page is ready. Returns a function that cancels it. */
export function onPageReady(callback: () => void): () => void {
  const ready = usePageReady()
  let called = false
  return watch(
    ready,
    (isReady) => {
      if (isReady && !called) {
        called = true
        callback()
      }
    },
    { immediate: true },
  )
}
