<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getProject } from '@/content/projects'

const route = useRoute()
const project = computed(() => getProject(String(route.params.slug)))

useHead({ title: () => project.value?.title ?? 'Proyecto no encontrado' })
</script>

<template>
  <main id="main" class="project">
    <template v-if="project">
      <p class="project__eyebrow">Caso de estudio · {{ project.year }}</p>
      <h1 class="project__title">{{ project.title }}</h1>
      <p class="project__summary">{{ project.summary }}</p>
      <ul class="project__stack">
        <li v-for="item in project.stack" :key="item">{{ item }}</li>
      </ul>
    </template>
    <template v-else>
      <h1 class="project__title">Proyecto no encontrado</h1>
    </template>
    <RouterLink class="project__back" to="/proyectos">← Volver a proyectos</RouterLink>
  </main>
</template>

<style scoped>
.project {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 100svh;
  padding: 160px var(--grid-margin) 80px;
}

.project__eyebrow,
.project__stack,
.project__back {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.project__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(40px, 9vw, 140px);
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.project__summary {
  max-width: 560px;
  font-size: 20px;
}

.project__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
  list-style: none;
}

.project__stack li {
  padding: 6px 12px;
  border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
  border-radius: var(--radius-pill);
}

.project__back {
  color: inherit;
}
</style>
