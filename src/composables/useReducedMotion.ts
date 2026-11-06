import { onBeforeUnmount, onMounted, ref } from 'vue'

const QUERY = '(prefers-reduced-motion: reduce)'

/** Reactive `prefers-reduced-motion`. Always `false` during SSR. */
export function useReducedMotion() {
  const reduced = ref(false)
  let media: MediaQueryList | undefined

  const update = () => {
    reduced.value = media?.matches ?? false
  }

  onMounted(() => {
    media = window.matchMedia(QUERY)
    update()
    media.addEventListener('change', update)
  })

  onBeforeUnmount(() => media?.removeEventListener('change', update))

  return reduced
}

/** One-off, non-reactive check for use outside components. */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches
}
