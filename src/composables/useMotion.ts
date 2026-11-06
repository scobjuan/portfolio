import { onBeforeUnmount, onMounted, type Ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export interface MotionEnv {
  /** `false` when the visitor prefers reduced motion: leave the static layout alone. */
  motion: boolean
  /** A mouse-like pointer is available (hover and fine precision). */
  fine: boolean
}

/**
 * Runs `setup` inside a GSAP matchMedia context scoped to `scope`.
 * Everything created inside is reverted on unmount or when a media condition
 * changes, so there is no manual cleanup. `setup` may return a cleanup function.
 */
export function useMotion(
  scope: Ref<HTMLElement | null>,
  setup: (env: MotionEnv, ctx: gsap.Context) => void | (() => void),
) {
  let mm: gsap.MatchMedia | undefined

  onMounted(() => {
    if (!scope.value) return
    mm = gsap.matchMedia(scope.value)
    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        fine: '(hover: hover) and (pointer: fine)',
      },
      (ctx) => {
        const { motion, fine } = ctx.conditions as unknown as MotionEnv
        return setup({ motion: Boolean(motion), fine: Boolean(fine) }, ctx)
      },
    )
  })

  onBeforeUnmount(() => mm?.revert())
}

/** Fades and lifts every `[data-reveal]` inside `scope` as it enters the viewport. */
export function revealOnScroll(scope: HTMLElement, selector = '[data-reveal]') {
  const items = gsap.utils.toArray<HTMLElement>(selector, scope)
  if (!items.length) return

  gsap.set(items, { autoAlpha: 0, y: 32 })
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        ease: 'expo.out',
        stagger: 0.08,
        overwrite: true,
      }),
  })
}

/** Easing shared by entrance animations. */
export const EASE_OUT = 'expo.out'
