<script setup lang="ts">
import { useHead } from '@unhead/vue'

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
</script>

<template>
  <RouterView />
</template>
