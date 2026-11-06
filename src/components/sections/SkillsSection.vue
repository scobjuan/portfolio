<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import { skillCategories, skills } from '@/content/skills'
import type { SkillCategoryId } from '@/content/types'
import { useMotion } from '@/composables/useMotion'
import { scrambleFrame, scrambleText } from '@/utils/text-effects'

const root = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const active = ref<SkillCategoryId>('frontend')

const countFor = (id: SkillCategoryId) => skills.filter((skill) => skill.category === id).length
// A fixed tilt per pill keeps the pile looking loose without random re-renders.
const tilt = (index: number) => `${[-3, 4, -7, 2, 8, -5, 3, -9][index % 8]}deg`

useMotion(root, ({ motion }) => {
  const section = root.value
  const title = heading.value
  if (!motion || !section || !title) return

  // Heading types in with a scramble, pills drop into the pile.
  const finalText = title.textContent ?? ''
  title.setAttribute('aria-label', finalText)
  title.textContent = scrambleFrame(finalText, 0)

  const pills = gsap.utils.toArray<HTMLElement>('.pill', section)
  gsap.set(pills, { opacity: 0 })

  ScrollTrigger.create({
    trigger: section,
    start: 'top 55%',
    once: true,
    onEnter: () => {
      scrambleText(title, finalText, 1.1)
      gsap.fromTo(
        pills,
        { yPercent: -400, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: 'bounce.out', stagger: 0.05 },
      )
    },
  })
})
</script>

<template>
  <section id="skills" ref="root" class="skills" data-theme="cobalt">
    <div class="skills__side">
      <SectionLabel index="04" label="Habilidades" />
      <h2 ref="heading" class="skills__title">Caja de herramientas</h2>
      <p class="skills__intro">Elige una categoría para ver qué uso en cada capa.</p>

      <div class="skills__tabs" role="group" aria-label="Categorías de habilidades">
        <button
          v-for="category in skillCategories"
          :key="category.id"
          type="button"
          class="tab"
          :aria-pressed="active === category.id"
          @click="active = category.id"
          @mouseenter="active = category.id"
          @focus="active = category.id"
        >
          <span>{{ category.label }}</span>
          <span class="tab__count">{{ String(countFor(category.id)).padStart(2, '0') }}</span>
        </button>
      </div>
    </div>

    <ul class="skills__pile">
      <li
        v-for="(skill, index) in skills"
        :key="skill.name"
        class="pill"
        :class="{
          'is-primary': skill.primary,
          'is-solid': skill.category === active,
        }"
        :style="{ '--tilt': tilt(index) }"
      >
        {{ skill.name }}
      </li>
    </ul>
  </section>
</template>

<style scoped>
.skills {
  position: relative;
  display: grid;
  grid-template-columns: minmax(300px, 420px) 1fr;
  gap: 48px;
  min-height: 100svh;
  padding: 140px var(--grid-margin) 80px;
}

.skills::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(color-mix(in srgb, var(--fg) 14%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--fg) 14%, transparent) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.skills__side,
.skills__pile {
  position: relative;
}

.skills__side {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skills__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 110%;
  font-size: clamp(30px, 3.2vw, 46px);
  line-height: 0.95;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.skills__intro {
  font-size: 16px;
  line-height: 1.5;
}

.skills__tabs {
  display: flex;
  flex-direction: column;
  margin-top: 18px;
  border-top: 1px solid color-mix(in srgb, var(--fg) 55%, transparent);
}

.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding: 0;
  border: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--fg) 55%, transparent);
  background: transparent;
  font-family: var(--font-display);
  font-weight: 800;
  font-stretch: 110%;
  font-size: 20px;
  text-transform: uppercase;
  text-align: left;
  opacity: 0.65;
  cursor: pointer;
  transition: opacity var(--dur-fast) linear;
}

.tab[aria-pressed='true'] {
  opacity: 1;
}

.tab__count {
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 400;
}

.skills__pile {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-end;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pill {
  padding: 12px 24px;
  border: 2px solid var(--fg);
  border-radius: var(--radius-pill);
  font-family: var(--font-display);
  font-weight: 800;
  font-stretch: 110%;
  font-size: 22px;
  text-transform: uppercase;
  rotate: var(--tilt);
  transition:
    background-color var(--dur-base) var(--ease-out),
    color var(--dur-base) var(--ease-out);
}

.pill.is-primary {
  padding: 16px 32px;
  font-stretch: 125%;
  font-size: 30px;
}

.pill.is-solid {
  background: var(--fg);
  color: var(--bg);
}

@media (max-width: 960px) {
  .skills {
    grid-template-columns: 1fr;
    padding-inline: 20px;
  }

  .skills__pile {
    align-content: flex-start;
  }

  .pill,
  .pill.is-primary {
    padding: 10px 18px;
    font-size: 18px;
  }
}
</style>
