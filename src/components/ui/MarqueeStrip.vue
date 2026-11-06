<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotion } from '@/composables/useMotion'

defineProps<{ items: string[] }>()

const root = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)

// The strip speeds up with scroll velocity and relaxes back to its base speed.
useMotion(root, ({ motion }) => {
  if (!motion || !track.value) return

  const loop = gsap.to(track.value, { xPercent: -50, duration: 26, ease: 'none', repeat: -1 })
  ScrollTrigger.create({
    onUpdate: (self) => {
      const boost = Math.min(Math.abs(self.getVelocity()) / 400, 6)
      gsap.to(loop, { timeScale: 1 + boost, duration: 0.3, overwrite: true })
      gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.3, overwrite: 'auto' })
    },
  })
})
</script>

<template>
  <div ref="root" class="marquee" aria-hidden="true">
    <div ref="track" class="marquee__track">
      <template v-for="copy in 2" :key="copy">
        <span v-for="item in items" :key="`${copy}-${item}`" class="marquee__item">
          {{ item }}<span class="marquee__dot">●</span>
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  border-top: 1px solid color-mix(in srgb, currentColor 18%, transparent);
}

.marquee__track {
  display: flex;
  width: max-content;
  padding-block: 14px;
  font-family: var(--font-display);
  font-weight: 800;
  font-stretch: 110%;
  font-size: 22px;
  text-transform: uppercase;
  white-space: nowrap;
}

.marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 36px;
  padding-right: 36px;
}

.marquee__dot {
  color: var(--accent);
  font-size: 0.6em;
}
</style>
