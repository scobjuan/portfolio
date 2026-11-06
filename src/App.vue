<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useHead } from '@unhead/vue'
import AppCursor from '@/components/layout/AppCursor.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppLoader from '@/components/layout/AppLoader.vue'
import GrainOverlay from '@/components/layout/GrainOverlay.vue'
import MobileMenu from '@/components/layout/MobileMenu.vue'
import { destroyLenis, initLenis } from '@/composables/useLenis'

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
  <RouterView />
</template>
