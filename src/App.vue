<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import AppCursor from '@/components/layout/AppCursor.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppLoader from '@/components/layout/AppLoader.vue'
import GrainOverlay from '@/components/layout/GrainOverlay.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'
import PageTransition from '@/components/layout/PageTransition.vue'
import { useRoute } from 'vue-router'
import { profile } from '@/content/profile'
import { useSeo, fullTitle } from '@/composables/useSeo'
import { normalizeSiteUrl } from '@/seo/site'
import { destroyLenis, initLenis } from '@/composables/useLenis'
import { cancelPageTransition, enterPage, leavePage } from '@/composables/usePageTransition'
import { getRouteLabel, getRouteTheme, getViewKey } from '@/router/meta'

const route = useRoute()
const siteUrl = normalizeSiteUrl(import.meta.env.VITE_SITE_URL)
// Home sections are anchors of one page, so they all point at the root.
const canonical = computed(() => siteUrl + (route.meta.section ? '/' : route.path))

useHead({
  htmlAttrs: { lang: 'es' },
  titleTemplate: (title) => fullTitle(title),
  link: [{ rel: 'canonical', href: () => canonical.value }],
  meta: [
    { property: 'og:site_name', content: profile.name },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'es_CO' },
    { property: 'og:url', content: () => canonical.value },
    { property: 'og:image', content: `${siteUrl}/og-image.png` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: `${profile.name}, ${profile.role.toLowerCase()}` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: `${siteUrl}/og-image.png` },
  ],
})

useSeo({
  description: `Portafolio de ${profile.name}, ${profile.role.toLowerCase()} con JavaScript y Vue 3.`,
})

// The route is already the destination when the old view starts leaving.
function onLeave(el: Element, done: () => void) {
  leavePage(el, done, {
    theme: getRouteTheme(route),
    label: getRouteLabel(route),
    path: route.path,
  })
}

onMounted(initLenis)
onBeforeUnmount(destroyLenis)
</script>

<template>
  <a class="skip-link" href="#main">Saltar al contenido</a>
  <AppLoader />
  <AppCursor />
  <GrainOverlay />
  <AppHeader />
  <MobileMenu />
  <PageTransition />
  <RouterView v-slot="{ Component, route: current }">
    <Transition
      :css="false"
      mode="out-in"
      @leave="onLeave"
      @enter="enterPage"
      @leave-cancelled="cancelPageTransition"
      @enter-cancelled="cancelPageTransition"
    >
      <component :is="Component" :key="getViewKey(current)" />
    </Transition>
  </RouterView>
</template>
