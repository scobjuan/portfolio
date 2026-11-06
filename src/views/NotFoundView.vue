<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

useSeo({ title: 'Página no encontrada', description: 'Esta página no existe.', noindex: true })
</script>

<template>
  <main>
    <h1>404</h1>
    <p>Esta página no existe.</p>
    <RouterLink to="/">Volver al inicio</RouterLink>
  </main>
</template>
