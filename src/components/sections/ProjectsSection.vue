<script setup lang="ts">
import { computed, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import { projectCategories, projects } from '@/content/projects'
import type { ProjectCategory } from '@/content/types'
import { EASE_OUT, useMotion } from '@/composables/useMotion'

const root = ref<HTMLElement | null>(null)
const preview = ref<HTMLElement | null>(null)
const filter = ref<ProjectCategory | 'all'>('all')
const activeSlug = ref<string | null>(null)

const visible = computed(() =>
  filter.value === 'all'
    ? projects
    : projects.filter((project) => project.category === filter.value),
)
const activeProject = computed(() => projects.find((project) => project.slug === activeSlug.value))
const countLabel = (id: string) =>
  String(
    id === 'all' ? projects.length : projects.filter((project) => project.category === id).length,
  )

useMotion(root, ({ motion, fine }) => {
  const section = root.value
  if (!motion || !section) return

  // Rows draw their divider and lift their title when they first enter.
  gsap.utils.toArray<HTMLElement>('.row', section).forEach((row) => {
    const line = row.querySelector('.row__line')
    const title = row.querySelector('.row__title')
    const meta = row.querySelectorAll('.row__index, .row__stack, .row__year')
    gsap.set(line, { scaleX: 0, transformOrigin: 'left' })
    gsap.set(title, { yPercent: 110 })
    gsap.set(meta, { autoAlpha: 0 })
    ScrollTrigger.create({
      trigger: row,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(line, { scaleX: 1, duration: 1.2, ease: EASE_OUT })
        gsap.to(title, { yPercent: 0, duration: 1, ease: EASE_OUT, delay: 0.1 })
        gsap.to(meta, { autoAlpha: 1, duration: 0.8, delay: 0.25 })
      },
    })
  })

  if (!fine || !preview.value) return

  // The preview follows the pointer with inertia and tilts with its horizontal speed.
  const box = preview.value
  gsap.set(box, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
  const moveX = gsap.quickTo(box, 'x', { duration: 0.6, ease: 'power3.out' })
  const moveY = gsap.quickTo(box, 'y', { duration: 0.6, ease: 'power3.out' })
  const tilt = gsap.quickTo(box, 'rotation', { duration: 0.5, ease: 'power3.out' })
  let lastX = 0

  const onMove = (event: PointerEvent) => {
    moveX(event.clientX + 40)
    moveY(event.clientY)
    tilt(gsap.utils.clamp(-6, 6, (event.clientX - lastX) * 0.4))
    lastX = event.clientX
  }
  const list = section.querySelector('.rows')
  const show = () =>
    gsap.to(box, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: EASE_OUT })
  const hide = () => {
    gsap.to(box, { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)', duration: 0.4, ease: EASE_OUT })
    activeSlug.value = null
  }
  gsap.set(box, { clipPath: 'inset(0% 0% 100% 0%)' })

  list?.addEventListener('pointermove', onMove as EventListener, { passive: true })
  list?.addEventListener('pointerenter', show)
  list?.addEventListener('pointerleave', hide)
  return () => {
    list?.removeEventListener('pointermove', onMove as EventListener)
    list?.removeEventListener('pointerenter', show)
    list?.removeEventListener('pointerleave', hide)
  }
})
</script>

<template>
  <section id="projects" ref="root" class="projects" data-theme="graphite">
    <header class="projects__head">
      <div class="projects__heading">
        <SectionLabel index="02" label="Proyectos" />
        <h2 class="projects__title">Trabajo selecto</h2>
      </div>

      <div class="projects__filters" role="group" aria-label="Filtrar proyectos">
        <button
          v-for="category in projectCategories"
          :key="category.id"
          type="button"
          class="chip"
          :aria-pressed="filter === category.id"
          @click="filter = category.id"
        >
          {{ category.label }} ({{ countLabel(category.id) }})
        </button>
      </div>
    </header>

    <TransitionGroup tag="ul" name="rows" class="rows">
      <li v-for="(project, index) in visible" :key="project.slug" class="row">
        <RouterLink
          class="row__link"
          :to="`/proyectos/${project.slug}`"
          data-cursor="project"
          data-cursor-label="Ver caso"
          @pointerenter="activeSlug = project.slug"
          @focus="activeSlug = project.slug"
        >
          <span class="row__index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="row__mask"
            ><span class="row__title">{{ project.title }}</span></span
          >
          <span class="row__stack">{{ project.stack.join(' · ') }}</span>
          <span class="row__year">{{ project.year }}</span>
        </RouterLink>
        <span class="row__line" aria-hidden="true"></span>
      </li>
    </TransitionGroup>

    <p class="projects__hint">Pasa el cursor sobre un proyecto para ver su vista previa.</p>

    <div
      ref="preview"
      class="preview"
      aria-hidden="true"
      :style="{ '--hue': activeProject?.hue ?? 72 }"
    >
      <span class="preview__label">[Captura del proyecto · 16:10]</span>
      <span class="preview__name">{{ activeProject?.title }}</span>
    </div>
  </section>
</template>

<style scoped>
.projects {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-height: 100svh;
  padding: 140px var(--grid-margin) 80px;
}

.projects__head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}

.projects__heading {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.projects__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(36px, 6vw, 88px);
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.projects__filters {
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

.rows {
  position: relative;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid color-mix(in srgb, var(--fg) 22%, transparent);
}

.row {
  position: relative;
  transition: opacity var(--dur-base) var(--ease-out);
}

.rows:hover .row:not(:hover),
.rows:has(:focus-visible) .row:not(:focus-within) {
  opacity: 0.35;
}

.row__link {
  display: grid;
  grid-template-columns: 70px 1fr 300px 80px;
  align-items: center;
  min-height: 106px;
  color: inherit;
  text-decoration: none;
}

.row__line {
  position: absolute;
  inset: auto 0 0;
  height: 1px;
  background: color-mix(in srgb, var(--fg) 22%, transparent);
}

.row__index,
.row__stack,
.row__year {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.row__year {
  text-align: right;
}

.row__mask {
  overflow: hidden;
  padding-block: 4px;
}

.row__title {
  display: block;
  font-family: var(--font-display);
  font-weight: 800;
  font-stretch: 100%;
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1.05;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  transition: font-stretch var(--dur-base) var(--ease-out);
}

.row__link:hover .row__title,
.row__link:focus-visible .row__title {
  font-stretch: 125%;
}

.rows-move,
.rows-enter-active,
.rows-leave-active {
  transition:
    transform var(--dur-base) var(--ease-out),
    opacity var(--dur-base) var(--ease-out);
}

.rows-enter-from,
.rows-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

.rows-leave-active {
  position: absolute;
  inset-inline: 0;
}

.projects__hint {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

.preview {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 340px;
  height: 220px;
  padding: 16px;
  border-radius: var(--radius-card);
  background: repeating-linear-gradient(
    135deg,
    hsl(var(--hue) 35% 22%) 0 14px,
    hsl(var(--hue) 35% 17%) 14px 28px
  );
  box-shadow: 0 30px 60px rgb(0 0 0 / 0.5);
  color: #fff;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  pointer-events: none;
  visibility: hidden;
}

@media (max-width: 960px) {
  .projects {
    padding-inline: 20px;
  }

  .row__link {
    grid-template-columns: 44px 1fr 56px;
    min-height: 88px;
  }

  .row__stack {
    display: none;
  }

  .projects__hint,
  .preview {
    display: none;
  }
}

@media (hover: none) {
  .projects__hint,
  .preview {
    display: none;
  }
}
</style>
