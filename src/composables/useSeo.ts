import { toValue, type MaybeRefOrGetter } from 'vue'
import { useHead } from '@unhead/vue'
import { profile } from '@/content/profile'

export const DEFAULT_TITLE = `${profile.name} | ${profile.role}`

/** Title as shown in the tab and in social previews. */
export function fullTitle(title?: string): string {
  return title ? `${title} | ${profile.name}` : DEFAULT_TITLE
}

interface SeoOptions {
  title?: MaybeRefOrGetter<string | undefined>
  description: MaybeRefOrGetter<string>
  /** Keep the page out of search results (used by the 404 page). */
  noindex?: boolean
}

/** Sets the title, description and social preview text of the current page. */
export function useSeo({ title, description, noindex = false }: SeoOptions) {
  useHead({
    title: () => toValue(title),
    meta: [
      { name: 'description', content: () => toValue(description) },
      { property: 'og:title', content: () => fullTitle(toValue(title)) },
      { property: 'og:description', content: () => toValue(description) },
      { name: 'twitter:title', content: () => fullTitle(toValue(title)) },
      { name: 'twitter:description', content: () => toValue(description) },
      ...(noindex ? [{ name: 'robots', content: 'noindex' }] : []),
    ],
  })
}
