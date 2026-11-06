<script setup lang="ts">
import { SECTIONS } from '@/router/routes'
import { useSectionRoute } from '@/composables/useSectionRoute'
import { useSectionTheme } from '@/composables/useSectionTheme'

useSectionTheme()
useSectionRoute()
</script>

<template>
  <main id="main">
    <!-- Placeholder blocks; each one is replaced by its real section in Phase 2. -->
    <section
      v-for="section in SECTIONS"
      :id="section.id"
      :key="section.id"
      class="placeholder"
      :data-theme="section.theme"
    >
      <h1 v-if="section.id === 'home'">Juan Escobar</h1>
      <h2 v-else>{{ section.label }}</h2>
      <p v-if="section.id === 'home'">
        Desarrollador web. Interfaces vivas con JavaScript y Vue 3.
      </p>
    </section>
  </main>
</template>

<style scoped>
.placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  min-height: 100svh;
  padding: 120px var(--grid-margin);
}

h1,
h2 {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(36px, 10vw, 180px);
  line-height: 0.85;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}
</style>
