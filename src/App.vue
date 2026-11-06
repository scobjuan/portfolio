<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import AppCursor from '@/components/layout/AppCursor.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppLoader from '@/components/layout/AppLoader.vue'
import GrainOverlay from '@/components/layout/GrainOverlay.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'
import PageTransition from '@/components/layout/PageTransition.vue'
import { useRoute } from 'vue-router'
import { destroyLenis, initLenis } from '@/composables/useLenis'
import { cancelPageTransition, enterPage, leavePage } from '@/composables/usePageTransition'
import { getRouteLabel, getRouteTheme, getViewKey } from '@/router/meta'

useHead({
  htmlAttrs: { lang: 'es' },
  titleTemplate: (title) =>
    title ? `${title} | Juan Escobar` : 'Juan Escobar | Desarrollador web',
  meta: [
    {
      name: 'description',
      content: 'Portafolio de Juan Escobar, desarrollador web con JavaScript y Vue 3.',
    },
  ],
})

const route = useRoute()

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
