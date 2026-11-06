<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/content/types'
import { EASE_OUT, useMotion } from '@/composables/useMotion'
import { onPageReady } from '@/composables/usePageTransition'

defineProps<{ projects: Project[] }>()
const emit = defineEmits<{ activate: [slug: string] }>()

const root = ref<HTMLElement | null>(null)

// Rows draw their divider and lift their title the first time they enter the screen.
useMotion(root, ({ motion }, ctx) => {
  const list = root.value
  if (!motion || !list) return

  const rows = gsap.utils.toArray<HTMLElement>('.row', list)
  rows.forEach((row) => {
    gsap.set(row.querySelector('.row__line'), { scaleX: 0, transformOrigin: 'left' })
    gsap.set(row.querySelector('.row__title'), { yPercent: 110 })
    gsap.set(row.querySelectorAll('.row__index, .row__stack, .row__year'), { opacity: 0 })
  })

  return onPageReady(() =>
    ctx.add(() => {
      rows.forEach((row) => {
        ScrollTrigger.create({
          trigger: row,
          start: 'top 90%',
          once: true,
          onEnter: () => {
            gsap.to(row.querySelector('.row__line'), { scaleX: 1, duration: 1.2, ease: EASE_OUT })
            gsap.to(row.querySelector('.row__title'), {
              yPercent: 0,
              duration: 1,
              ease: EASE_OUT,
              delay: 0.1,
            })
            gsap.to(row.querySelectorAll('.row__index, .row__stack, .row__year'), {
              opacity: 1,
              duration: 0.8,
              delay: 0.25,
            })
          },
        })
      })
    }),
  )
})
</script>

<template>
  <div ref="root">
    <TransitionGroup tag="ul" name="rows" class="rows">
      <li v-for="(project, index) in projects" :key="project.slug" class="row">
        <RouterLink
          class="row__link"
          :to="`/proyectos/${project.slug}`"
          data-cursor="project"
          data-cursor-label="Ver caso"
          @pointerenter="emit('activate', project.slug)"
          @focus="emit('activate', project.slug)"
        >
          <span class="row__thumb" aria-hidden="true" :style="{ '--hue': project.hue }"></span>
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
  </div>
</template>

<style scoped>
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

/* Mobile: each project becomes a card with a thumbnail, as in the mobile mockup. */
.row__thumb {
  display: none;
}

@media (max-width: 960px) {
  .row__link {
    grid-template-columns: 1fr auto;
    grid-template-areas:
      'thumb thumb'
      'title year'
      'stack stack';
    gap: 12px 16px;
    align-items: baseline;
    padding-block: 20px 22px;
  }

  .row__thumb {
    display: block;
    grid-area: thumb;
    height: 200px;
    border-radius: var(--radius-card);
    background: repeating-linear-gradient(
      135deg,
      hsl(var(--hue) 35% 22%) 0 12px,
      hsl(var(--hue) 35% 17%) 12px 24px
    );
  }

  .row__index {
    display: none;
  }

  .row__mask {
    grid-area: title;
  }

  .row__title {
    font-size: clamp(22px, 6.4vw, 28px);
  }

  .row__year {
    grid-area: year;
  }

  .row__stack {
    grid-area: stack;
    opacity: 0.75;
  }
}
</style>
