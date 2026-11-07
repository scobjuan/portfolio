<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectFilters from '@/components/ui/ProjectFilters.vue'
import ProjectList from '@/components/ui/ProjectList.vue'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import { featuredProjects, projects } from '@/content/projects'
import type { ProjectCategory } from '@/content/types'
import { EASE_OUT, useMotion } from '@/composables/useMotion'
import type { PreviewGL } from '@/effects/projectPreviewGL'

const root = ref<HTMLElement | null>(null)
const preview = ref<HTMLElement | null>(null)
const filter = ref<ProjectCategory | 'all'>('all')
const activeSlug = ref<string | null>(null)

const visible = computed(() =>
  filter.value === 'all'
    ? featuredProjects
    : featuredProjects.filter((project) => project.category === filter.value),
)
const activeProject = computed(() => projects.find((project) => project.slug === activeSlug.value))

// The preview follows the pointer with inertia and tilts with its horizontal speed.
useMotion(root, ({ motion, fine }) => {
  const section = root.value
  const box = preview.value
  if (!motion || !fine || !section || !box) return

  gsap.set(box, { xPercent: -50, yPercent: -50, autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' })
  const moveX = gsap.quickTo(box, 'x', { duration: 0.6, ease: 'power3.out' })
  const moveY = gsap.quickTo(box, 'y', { duration: 0.6, ease: 'power3.out' })
  const tilt = gsap.quickTo(box, 'rotation', { duration: 0.5, ease: 'power3.out' })
  let lastX = 0

  // WebGL distortion: a separate chunk, fetched when the section is reached. If it
  // fails or WebGL is missing, the CSS placeholder stays.
  let gl: PreviewGL | undefined
  let hovering = false
  let alive = true
  const syncGl = () => {
    gl?.setActive(hovering)
    const project = activeProject.value
    if (gl && project) gl.setProject(project)
  }
  const stopWatch = watch(activeProject, syncGl)
  ScrollTrigger.create({
    trigger: section,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      import('@/effects/projectPreviewGL')
        .then(({ mountProjectPreviewGL }) => mountProjectPreviewGL(box))
        .then((instance) => {
          if (!alive) return instance.destroy()
          gl = instance
          box.classList.add('has-webgl')
          syncGl()
        })
        .catch(() => undefined)
    },
  })

  const onMove = (event: PointerEvent) => {
    moveX(event.clientX + 40)
    moveY(event.clientY)
    const speed = event.clientX - lastX
    tilt(gsap.utils.clamp(-6, 6, speed * 0.4))
    gl?.setVelocity(Math.hypot(speed, event.movementY))
    lastX = event.clientX
  }
  const show = () => {
    hovering = true
    gl?.setActive(true)
    gsap.to(box, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: EASE_OUT })
  }
  const hide = () => {
    hovering = false
    gsap.to(box, {
      autoAlpha: 0,
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.4,
      ease: EASE_OUT,
      onComplete: () => {
        if (!hovering) gl?.setActive(false)
      },
    })
    activeSlug.value = null
  }

  const list = section.querySelector('.rows')
  list?.addEventListener('pointermove', onMove as EventListener, { passive: true })
  list?.addEventListener('pointerenter', show)
  list?.addEventListener('pointerleave', hide)
  return () => {
    alive = false
    stopWatch()
    gl?.destroy()
    box.classList.remove('has-webgl')
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
      <ProjectFilters v-model="filter" :projects="featuredProjects" />
    </header>

    <ProjectList :projects="visible" @activate="activeSlug = $event" />

    <footer class="projects__foot">
      <p class="projects__hint">Pasa el cursor sobre un proyecto para ver su vista previa.</p>
      <RouterLink class="projects__all" to="/archivo"
        >Ver archivo completo ({{ projects.length }}) →</RouterLink
      >
    </footer>

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

.projects__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.projects__hint {
  opacity: 0.6;
}

.projects__all {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: inherit;
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
  overflow: hidden;
}

/* The WebGL canvas covers the CSS placeholder once it is ready. */
.preview :deep(.preview__canvas) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.preview.has-webgl .preview__label,
.preview.has-webgl .preview__name {
  visibility: hidden;
}

@media (max-width: 960px) {
  .projects {
    padding-inline: 20px;
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
