<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { LOADER_SEEN_KEY, useLoader } from '@/composables/useLoader'
import { lockScroll, unlockScroll } from '@/composables/useLenis'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const MIN_SECONDS = 1.2
const MAX_WAIT_MS = 2500

const loader = useLoader()
const root = ref<HTMLElement | null>(null)
const lime = ref<HTMLElement | null>(null)
const progress = ref(0)
const counter = computed(() => String(Math.round(progress.value)).padStart(3, '0'))

function pageLoaded(): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve()
  return new Promise((resolve) => window.addEventListener('load', () => resolve(), { once: true }))
}

function finish() {
  try {
    sessionStorage.setItem(LOADER_SEEN_KEY, '1')
  } catch {
    // Storage can be unavailable (private mode); the loader just shows again.
  }
  loader.done = true
}

onMounted(async () => {
  // The inline script in index.html marks returning visitors to avoid a flash.
  if (document.documentElement.dataset.loader === 'skip') {
    loader.done = true
    return
  }

  lockScroll()
  const reduced = prefersReducedMotion()
  const state = { value: 0 }
  const sync = () => (progress.value = state.value)

  // Real readiness: fonts and page load, capped so a slow asset never blocks the site.
  const ready = Promise.race([
    Promise.all([document.fonts.ready, pageLoaded()]),
    new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS)),
  ])

  await gsap.to(state, {
    value: 90,
    duration: reduced ? 0.2 : MIN_SECONDS,
    ease: 'power2.out',
    onUpdate: sync,
  })
  await ready
  await gsap.to(state, { value: 100, duration: reduced ? 0.05 : 0.3, ease: 'none', onUpdate: sync })

  if (reduced) {
    await gsap.to(root.value, { opacity: 0, duration: 0.2 })
  } else {
    const exit = gsap.timeline({ defaults: { duration: 0.9, ease: 'expo.inOut' } })
    exit.to(lime.value, { clipPath: 'inset(0 0 100% 0)' }, 0.12)
    exit.to(root.value, { clipPath: 'inset(0 0 100% 0)' }, 0)
    await exit
  }

  unlockScroll()
  finish()
})
</script>

<template>
  <div v-if="!loader.done" class="loader-wrap" aria-live="polite">
    <div ref="lime" class="loader__lime" aria-hidden="true"></div>
    <div ref="root" class="loader" role="status" aria-label="Cargando">
      <div class="loader__top">
        <span>Juan Escobar</span>
        <span>Portafolio 2026</span>
      </div>
      <div class="loader__bottom">
        <span class="loader__count" aria-hidden="true">{{ counter }}</span>
        <div class="loader__bar" aria-hidden="true">
          <div class="loader__fill" :style="{ transform: `scaleX(${progress / 100})` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader__lime,
.loader {
  position: fixed;
  inset: 0;
  clip-path: inset(0);
}

.loader__lime {
  z-index: calc(var(--z-loader) - 1);
  background: var(--color-lime);
}

.loader {
  z-index: var(--z-loader);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px var(--grid-margin) 40px;
  background: var(--color-ink);
  color: var(--color-bone);
}

.loader__top {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ash);
}

.loader__bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.loader__count {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(96px, 22vw, 260px);
  line-height: 0.8;
  letter-spacing: -0.05em;
  font-variant-numeric: tabular-nums;
}

.loader__bar {
  width: min(240px, 30vw);
  height: 3px;
  margin-bottom: 8px;
  background: var(--color-graphite);
}

.loader__fill {
  height: 100%;
  background: var(--color-lime);
  transform-origin: left;
}

@media (max-width: 600px) {
  .loader {
    padding-inline: 20px;
  }
}
</style>
