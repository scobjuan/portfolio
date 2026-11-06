import { onBeforeUnmount, onMounted } from 'vue'
import type { ThemeId } from '@/router/routes'

/** Sets the page atmosphere (`data-theme` on body) for views that are not home sections. */
export function usePageTheme(theme: ThemeId) {
  onMounted(() => {
    document.body.dataset.theme = theme
  })
  onBeforeUnmount(() => {
    delete document.body.dataset.theme
  })
}
