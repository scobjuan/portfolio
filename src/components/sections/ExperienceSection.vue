<script setup lang="ts">
import { computed, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import { experience } from '@/content/experience'
import { EASE_OUT, useMotion } from '@/composables/useMotion'

const root = ref<HTMLElement | null>(null)
const tens = ref<HTMLElement | null>(null)
const units = ref<HTMLElement | null>(null)
const progress = ref<HTMLElement | null>(null)

const activeId = ref(experience[0]?.id ?? '')
const expandedId = ref(experience[0]?.id ?? '')
const activeItem = computed(() => experience.find((item) => item.id === activeId.value))
const DIGITS = Array.from({ length: 10 }, (_, digit) => digit)

/** Rolls a digit column so `digit` shows in its window. */
function roll(column: HTMLElement | null, digit: number, animate: boolean) {
  if (!column) return
  gsap.to(column, { yPercent: -digit * 10, duration: animate ? 0.9 : 0, ease: EASE_OUT })
}

function showYear(year: number, animate: boolean) {
  const [tensDigit = 0, unitsDigit = 0] = String(year % 100)
    .padStart(2, '0')
    .split('')
    .map(Number)
  roll(tens.value, tensDigit, animate)
  roll(units.value, unitsDigit, animate)
}

// Hovering opens an item; the click that follows pins it open instead of closing it.
let openedByHover = ''
function toggle(id: string) {
  if (openedByHover === id) {
    openedByHover = ''
    return
  }
  expandedId.value = expandedId.value === id ? '' : id
}

useMotion(root, ({ motion, fine }) => {
  const section = root.value
  if (!motion || !section) return

  showYear(experience[0]?.startYear ?? 0, false)

  // The pinned year changes as each position crosses the middle of the screen.
  gsap.utils.toArray<HTMLElement>('.job', section).forEach((job, index) => {
    const item = experience[index]
    if (!item) return
    ScrollTrigger.create({
      trigger: job,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (!self.isActive) return
        activeId.value = item.id
        showYear(item.startYear, true)
      },
    })
  })

  // The vertical line fills with the progress through the list.
  gsap.fromTo(
    progress.value,
    { scaleY: 0 },
    {
      scaleY: 1,
      ease: 'none',
      transformOrigin: 'top',
      scrollTrigger: { trigger: '.jobs', start: 'top 55%', end: 'bottom 55%', scrub: true },
    },
  )

  if (fine) {
    const jobs = section.querySelectorAll<HTMLElement>('.job')
    const enters = Array.from(jobs).map((job, index) => {
      const handler = () => {
        const id = experience[index]?.id ?? ''
        if (expandedId.value !== id) openedByHover = id
        expandedId.value = id
      }
      job.addEventListener('pointerenter', handler)
      return () => job.removeEventListener('pointerenter', handler)
    })
    return () => enters.forEach((remove) => remove())
  }
})
</script>

<template>
  <section id="experience" ref="root" class="experience" data-theme="ink">
    <div class="experience__side">
      <div class="experience__heading">
        <SectionLabel index="05" label="Experiencia" />
        <h2 class="experience__title">Recorrido</h2>
      </div>

      <div class="year" aria-live="polite">
        <span class="year__caption">Año en pantalla</span>
        <span class="year__digits" aria-hidden="true">
          <span class="year__window">
            <span ref="tens" class="year__column"
              ><span v-for="digit in DIGITS" :key="digit">{{ digit }}</span></span
            >
          </span>
          <span class="year__window">
            <span ref="units" class="year__column"
              ><span v-for="digit in DIGITS" :key="digit">{{ digit }}</span></span
            >
          </span>
        </span>
        <span class="sr-only">{{ activeItem?.startYear }}</span>
        <span class="year__until">— {{ activeItem?.endYear ?? 'Hoy' }}</span>
      </div>
    </div>

    <div class="timeline">
      <div class="timeline__rail" aria-hidden="true">
        <span ref="progress" class="timeline__fill"></span>
      </div>

      <ol class="jobs">
        <li
          v-for="item in experience"
          :key="item.id"
          class="job"
          :class="{ 'is-active': item.id === activeId, 'is-current': item.endYear === null }"
        >
          <span class="job__dot" aria-hidden="true"></span>
          <button
            type="button"
            class="job__head"
            :aria-expanded="expandedId === item.id"
            :aria-controls="`job-${item.id}`"
            @click="toggle(item.id)"
          >
            <span class="job__period">{{ item.startYear }} — {{ item.endYear ?? 'Actual' }}</span>
            <span class="job__role">{{ item.role }} · {{ item.company }}</span>
            <span class="job__sign" aria-hidden="true">{{
              expandedId === item.id ? '−' : '+'
            }}</span>
          </button>
          <div
            :id="`job-${item.id}`"
            class="job__panel"
            :class="{ 'is-open': expandedId === item.id }"
          >
            <div class="job__inner">
              <p class="job__summary">{{ item.summary }}</p>
              <ul class="job__stack">
                <li v-for="tech in item.stack" :key="tech">{{ tech }}</li>
              </ul>
            </div>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.experience {
  display: grid;
  grid-template-columns: minmax(280px, 470px) 1fr;
  gap: 56px;
  padding: 140px var(--grid-margin) 120px;
}

.experience__side {
  position: sticky;
  top: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 48px;
  height: calc(100svh - 190px);
  min-height: 420px;
}

.experience__heading {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.experience__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(36px, 4.4vw, 56px);
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.year {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.year__caption {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-ash);
}

.year__digits {
  display: flex;
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(96px, 12vw, 170px);
  line-height: 1;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 2px var(--fg);
}

.year__window {
  display: block;
  height: 1em;
  overflow: hidden;
}

.year__column {
  display: flex;
  flex-direction: column;
}

.year__column > span {
  display: block;
  height: 1em;
}

.year__until {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(32px, 4vw, 60px);
  line-height: 1;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  color: var(--accent);
}

.timeline {
  position: relative;
  padding-left: 50px;
}

.timeline__rail {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 13px;
  width: 2px;
  background: color-mix(in srgb, var(--fg) 18%, transparent);
}

.timeline__fill {
  position: absolute;
  inset: 0;
  background: var(--accent);
  transform-origin: top;
}

.jobs {
  margin: 0;
  padding: 0;
  list-style: none;
}

.job {
  position: relative;
  min-height: 36svh;
  padding-block: 8px 28px;
  border-bottom: 1px solid color-mix(in srgb, var(--fg) 16%, transparent);
}

/* Only the title dims; small labels keep full contrast. */
.job__role {
  opacity: 0.6;
  transition: opacity var(--dur-base) var(--ease-out);
}

.job.is-active .job__role,
.job__head:hover .job__role {
  opacity: 1;
}

.job__dot {
  position: absolute;
  top: 18px;
  left: -43px;
  width: 12px;
  height: 12px;
  border: 2px solid var(--color-ash);
  border-radius: 50%;
  background: var(--bg);
}

.job.is-current .job__dot {
  border-color: var(--accent);
  background: var(--accent);
  animation: pulse-ring 2s var(--ease-out) infinite;
}

@keyframes pulse-ring {
  0%,
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 60%, transparent);
  }
  50% {
    box-shadow: 0 0 0 10px transparent;
  }
}

.job__head {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'period sign'
    'role sign';
  gap: 8px 16px;
  width: 100%;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
  cursor: pointer;
}

.job__period {
  grid-area: period;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ash);
}

.job.is-current .job__period {
  color: var(--accent);
}

.job__role {
  grid-area: role;
  font-family: var(--font-display);
  font-weight: 800;
  font-stretch: 110%;
  font-size: clamp(22px, 2.6vw, 32px);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.job__sign {
  grid-area: sign;
  align-self: center;
  font-family: var(--font-mono);
  font-size: 20px;
  color: var(--color-ash);
}

.job__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--dur-base) var(--ease-out);
}

.job__panel.is-open {
  grid-template-rows: 1fr;
}

.job__inner {
  min-height: 0;
  overflow: hidden;
}

.job__summary {
  max-width: 560px;
  padding-top: 14px;
  font-size: 16px;
  line-height: 1.55;
  color: var(--color-bone);
}

.job__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.job__stack li {
  padding: 5px 10px;
  border: 1px solid color-mix(in srgb, var(--fg) 30%, transparent);
  border-radius: var(--radius-pill);
}

@media (max-width: 960px) {
  .experience {
    grid-template-columns: 1fr;
    gap: 32px;
    padding-inline: 20px;
  }

  .experience__side {
    position: static;
    height: auto;
    min-height: 0;
  }

  .job {
    min-height: 0;
  }
}
</style>
