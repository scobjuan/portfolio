import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { SECTIONS, getSection, type SectionId } from '@/router/routes'

/** Section currently crossing the middle of the viewport. */
export const activeSection = ref<SectionId>('home')

/**
 * Tracks which section is in view and sets `data-theme` on `<body>`
 * so the page atmosphere (--bg, --fg, --accent) changes per section.
 * Sections must be elements whose `id` matches a `SECTIONS` id.
 */
export function useSectionTheme() {
  let observer: IntersectionObserver | undefined

  const applyTheme = (id: SectionId) => {
    document.body.dataset.theme = getSection(id)?.theme ?? 'ink'
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeSection.value = entry.target.id as SectionId
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    applyTheme(activeSection.value)
    watch(activeSection, applyTheme)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    delete document.body.dataset.theme
    activeSection.value = 'home'
  })
}
