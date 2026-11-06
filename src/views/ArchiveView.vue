<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import ProjectFilters from '@/components/ui/ProjectFilters.vue'
import ProjectList from '@/components/ui/ProjectList.vue'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import { projects } from '@/content/projects'
import type { ProjectCategory } from '@/content/types'
import { EASE_OUT, useMotion } from '@/composables/useMotion'
import { usePageTheme } from '@/composables/usePageTheme'
import { onPageReady } from '@/composables/usePageTransition'
import gsap from 'gsap'

usePageTheme('graphite')
useHead({
  title: 'Archivo',
  meta: [
    {
      name: 'description',
      content: 'Todos los proyectos de Juan Escobar, del más reciente al más antiguo.',
    },
  ],
})

const root = ref<HTMLElement | null>(null)
const filter = ref<ProjectCategory | 'all'>('all')
const visible = computed(() =>
  filter.value === 'all'
    ? projects
    : projects.filter((project) => project.category === filter.value),
)

// Title rises from its mask and the controls fade in once the page is on screen.
useMotion(root, ({ motion }, ctx) => {
  if (!motion || !root.value) return
  const title = root.value.querySelector('.archive__title')
  const fades = root.value.querySelectorAll('[data-fade]')
  gsap.set(title, { yPercent: 110 })
  gsap.set(fades, { opacity: 0, y: 24 })

  return onPageReady(() =>
    ctx.add(() => {
      gsap.to(title, { yPercent: 0, duration: 1.1, ease: EASE_OUT })
      gsap.to(fades, { opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 0.3, ease: EASE_OUT })
    }),
  )
})
</script>

<template>
  <main id="main" ref="root" class="archive">
    <header class="archive__head">
      <div class="archive__heading">
        <span data-fade><SectionLabel index="02" label="Archivo" /></span>
        <div class="archive__mask">
          <h1 class="archive__title">Archivo</h1>
        </div>
        <p class="archive__intro" data-fade>
          Todos los proyectos, del más reciente al más antiguo: {{ projects.length }} en total.
        </p>
      </div>
      <div data-fade><ProjectFilters v-model="filter" :projects="projects" /></div>
    </header>

    <ProjectList :projects="visible" />

    <RouterLink class="archive__back" to="/proyectos" data-fade>← Volver a proyectos</RouterLink>
  </main>
</template>

<style scoped>
.archive {
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-height: 100svh;
  padding: 150px var(--grid-margin) 80px;
}

.archive__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.archive__heading {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.archive__mask {
  overflow: hidden;
  padding-block: 0.06em;
}

.archive__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(48px, 11vw, 168px);
  line-height: 0.88;
  letter-spacing: -0.045em;
  text-transform: uppercase;
}

.archive__intro {
  max-width: 460px;
  font-size: 18px;
  line-height: 1.45;
}

.archive__back {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: inherit;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 960px) {
  .archive {
    padding-inline: 20px;
  }
}
</style>
