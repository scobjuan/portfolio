<script setup lang="ts">
import { projectCategories } from '@/content/projects'
import type { Project, ProjectCategory } from '@/content/types'

const props = defineProps<{ projects: Project[] }>()
const filter = defineModel<ProjectCategory | 'all'>({ required: true })

const countFor = (id: string) =>
  id === 'all' ? props.projects.length : props.projects.filter((p) => p.category === id).length
</script>

<template>
  <div class="filters" role="group" aria-label="Filtrar proyectos">
    <button
      v-for="category in projectCategories"
      :key="category.id"
      type="button"
      class="chip"
      :aria-pressed="filter === category.id"
      @click="filter = category.id"
    >
      {{ category.label }} ({{ countFor(category.id) }})
    </button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  min-height: 44px;
  padding: 0 18px;
  border: 1px solid color-mix(in srgb, var(--fg) 30%, transparent);
  border-radius: var(--radius-pill);
  background: transparent;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background-color var(--dur-fast) linear,
    color var(--dur-fast) linear;
}

.chip[aria-pressed='true'] {
  border-color: var(--fg);
  background: var(--fg);
  color: var(--bg);
}

@media (max-width: 960px) {
  .filters {
    flex-wrap: nowrap;
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .chip {
    flex-shrink: 0;
  }
}
</style>
