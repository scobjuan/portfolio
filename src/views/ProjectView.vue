<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSeo } from '@/composables/useSeo'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectVisual from '@/components/ui/ProjectVisual.vue'
import { getNextProject, getProject } from '@/content/projects'
import { EASE_OUT, revealOnScroll, useMotion } from '@/composables/useMotion'
import { usePageTheme } from '@/composables/usePageTheme'
import { onPageReady } from '@/composables/usePageTransition'

usePageTheme('bone')

const route = useRoute()
const project = computed(() => getProject(String(route.params.slug)))
const next = computed(() => getNextProject(String(route.params.slug)))

useSeo({
  title: () => project.value?.title ?? 'Proyecto no encontrado',
  description: () => project.value?.summary ?? 'Este proyecto no existe.',
  noindex: false,
})

const root = ref<HTMLElement | null>(null)

useMotion(root, ({ motion }, ctx) => {
  const page = root.value
  if (!motion || !page) return

  const title = page.querySelector('.project__title')
  const cover = page.querySelector('.project__cover')
  const coverInner = page.querySelector('.project__cover > *')
  const intro = page.querySelectorAll('[data-intro]')

  gsap.set(title, { yPercent: 110 })
  gsap.set(intro, { opacity: 0, y: 24 })
  gsap.set(cover, { clipPath: 'inset(100% 0 0 0)' })
  revealOnScroll(page)

  return onPageReady(() =>
    ctx.add(() => {
      gsap.to(title, { yPercent: 0, duration: 1.1, ease: EASE_OUT })
      gsap.to(intro, { opacity: 1, y: 0, duration: 1, stagger: 0.1, delay: 0.3, ease: EASE_OUT })
      gsap.to(cover, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut', delay: 0.2 })
      // The cover drifts slightly slower than the page.
      gsap.fromTo(
        coverInner,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: cover, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
      ScrollTrigger.refresh()
    }),
  )
})
</script>

<template>
  <main id="main" ref="root" class="project">
    <template v-if="project">
      <header class="project__head">
        <p class="project__eyebrow" data-intro>
          <RouterLink to="/proyectos">← Proyectos</RouterLink>
          <span>Caso de estudio · {{ project.year }}</span>
        </p>
        <div class="project__mask">
          <h1 class="project__title">{{ project.title }}</h1>
        </div>
        <p class="project__summary" data-intro>{{ project.summary }}</p>
      </header>

      <dl class="project__meta" data-intro>
        <div>
          <dt>Año</dt>
          <dd>{{ project.year }}</dd>
        </div>
        <div>
          <dt>Rol</dt>
          <dd>{{ project.role }}</dd>
        </div>
        <div>
          <dt>Stack</dt>
          <dd>{{ project.stack.join(' · ') }}</dd>
        </div>
        <div v-if="project.links.live || project.links.repo">
          <dt>Enlaces</dt>
          <dd class="project__links">
            <a
              v-if="project.links.live"
              :href="project.links.live"
              target="_blank"
              rel="noopener noreferrer"
              >Sitio ↗</a
            >
            <a
              v-if="project.links.repo"
              :href="project.links.repo"
              target="_blank"
              rel="noopener noreferrer"
              >Código ↗</a
            >
          </dd>
        </div>
      </dl>

      <div class="project__cover">
        <ProjectVisual :hue="project.hue" label="[Imagen principal · 16:9]" ratio="16 / 8" />
      </div>

      <section class="project__story">
        <div data-reveal>
          <h2>El reto</h2>
          <p>{{ project.challenge }}</p>
        </div>
        <div data-reveal>
          <h2>La solución</h2>
          <p>{{ project.solution }}</p>
        </div>
      </section>

      <div class="project__gallery">
        <div data-reveal>
          <ProjectVisual :hue="project.hue + 20" label="[Detalle 1 · 4:3]" ratio="4 / 3" />
        </div>
        <div data-reveal>
          <ProjectVisual :hue="project.hue - 20" label="[Detalle 2 · 4:3]" ratio="4 / 3" />
        </div>
      </div>

      <section class="project__results" data-reveal>
        <h2>Resultados</h2>
        <ol>
          <li v-for="(result, index) in project.results" :key="result">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            {{ result }}
          </li>
        </ol>
      </section>

      <RouterLink
        v-if="next"
        class="project__next"
        :to="`/proyectos/${next.slug}`"
        data-cursor="project"
        data-cursor-label="Ir"
      >
        <span class="project__next-label">Siguiente proyecto</span>
        <span class="project__next-title">{{ next.title }}</span>
      </RouterLink>
    </template>

    <template v-else>
      <div class="project__mask">
        <h1 class="project__title">Proyecto no encontrado</h1>
      </div>
      <RouterLink class="project__back" to="/archivo">← Ver todos los proyectos</RouterLink>
    </template>
  </main>
</template>

<style scoped>
.project {
  display: flex;
  flex-direction: column;
  gap: 56px;
  padding: 150px var(--grid-margin) 0;
}

.project__head {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.project__eyebrow {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.project__eyebrow a,
.project__back,
.project__links a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  color: inherit;
}

.project__mask {
  overflow: hidden;
  padding-block: 0.06em;
}

.project__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 110%;
  font-size: clamp(34px, 8vw, 128px);
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}

.project__summary {
  max-width: 620px;
  font-size: clamp(18px, 1.8vw, 24px);
  line-height: 1.4;
}

.project__meta {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  margin: 0;
  padding-top: 24px;
  border-top: 1px solid var(--fg);
}

.project__meta dt {
  margin-bottom: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #5e5b54;
}

.project__meta dd {
  margin: 0;
  font-size: 17px;
  line-height: 1.4;
}

.project__links {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
}

.project__cover {
  overflow: hidden;
  border-radius: var(--radius-card);
}

.project__cover > * {
  scale: 1.12;
}

.project__story {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 48px;
}

.project__story h2,
.project__results h2 {
  margin-bottom: 14px;
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(24px, 2.6vw, 36px);
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.project__story p {
  font-size: 19px;
  line-height: 1.55;
}

.project__gallery {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.project__results ol {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--fg);
}

.project__results li {
  display: flex;
  align-items: baseline;
  gap: 24px;
  padding-block: 18px;
  border-bottom: 1px solid color-mix(in srgb, var(--fg) 25%, transparent);
  font-family: var(--font-display);
  font-weight: 800;
  font-stretch: 105%;
  font-size: clamp(20px, 2.4vw, 32px);
  letter-spacing: -0.02em;
}

.project__results li span {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 400;
}

.project__next {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-inline: calc(var(--grid-margin) * -1);
  padding: 72px var(--grid-margin) 80px;
  background: var(--color-ink);
  color: var(--color-bone);
  text-decoration: none;
}

.project__next-label {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ash);
}

.project__next-title {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 100%;
  font-size: clamp(32px, 7vw, 112px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
  transition: font-stretch var(--dur-slow) var(--ease-out);
}

.project__next:hover .project__next-title,
.project__next:focus-visible .project__next-title {
  font-stretch: 125%;
}

@media (max-width: 960px) {
  .project {
    gap: 40px;
    padding-inline: 20px;
  }

  .project__meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .project__story,
  .project__gallery {
    grid-template-columns: 1fr;
    gap: 32px;
  }

  .project__next {
    margin-inline: -20px;
    padding-inline: 20px;
  }
}
</style>
