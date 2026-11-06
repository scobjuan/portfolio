import { onBeforeUnmount, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSection, type SectionId } from '@/router/routes'
import { prefersReducedMotion } from './useReducedMotion'
import { scrollToElement } from './useLenis'
import { activeSection } from './useSectionTheme'

/**
 * Keeps the URL and the scroll position of the home page in sync:
 * - opening a section URL (or clicking a nav link) scrolls to that section;
 * - scrolling to another section updates the URL with `router.replace`.
 * While a programmatic scroll runs, URL updates from scrolling are paused.
 */
export function useSectionRoute() {
  const route = useRoute()
  const router = useRouter()
  let locked = false
  let fallbackTimer: ReturnType<typeof setTimeout> | undefined
  const stops: Array<() => void> = []

  const syncUrl = (id: SectionId) => {
    const path = getSection(id)?.path
    if (path && route.path !== path) router.replace(path)
  }

  // The URL already points at the target, so there is nothing to sync when a
  // programmatic scroll ends; just trust the destination over the observer,
  // which can still report the previous section for a frame.
  const release = (target: SectionId) => {
    clearTimeout(fallbackTimer)
    locked = false
    activeSection.value = target
  }

  const goTo = (id: SectionId, immediate: boolean) => {
    const el = document.getElementById(id)
    if (!el) return
    locked = true
    clearTimeout(fallbackTimer)
    fallbackTimer = setTimeout(() => release(id), 2000)
    scrollToElement(el, { immediate, onComplete: () => release(id) })
  }

  onMounted(() => {
    const initial = route.meta.section as SectionId | undefined
    if (initial && initial !== 'home') goTo(initial, true)

    stops.push(
      watch(
        () => route.meta.section as SectionId | undefined,
        (id) => {
          if (id && id !== activeSection.value) goTo(id, prefersReducedMotion())
        },
      ),
      watch(activeSection, (id) => {
        if (!locked) syncUrl(id)
      }),
    )
  })

  onBeforeUnmount(() => {
    clearTimeout(fallbackTimer)
    stops.forEach((stop) => stop())
  })
}
