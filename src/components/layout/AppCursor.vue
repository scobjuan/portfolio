<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { resolveCursor, useCursor } from '@/composables/useCursor'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const cursor = useCursor()
const enabled = ref(false)
const dot = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)

let moveDot: ((value: number) => void) | undefined
let moveDotY: ((value: number) => void) | undefined
let moveRing: ((value: number) => void) | undefined
let moveRingY: ((value: number) => void) | undefined

function onMove(event: PointerEvent) {
  if (cursor.variant === 'hidden') cursor.variant = 'default'
  moveDot?.(event.clientX)
  moveDotY?.(event.clientY)
  moveRing?.(event.clientX)
  moveRingY?.(event.clientY)
}

function onOver(event: PointerEvent) {
  const { variant, label } = resolveCursor(event.target)
  cursor.variant = variant
  cursor.label = label
}

const onDown = () => (cursor.pressed = true)
const onUp = () => (cursor.pressed = false)
const onLeave = () => (cursor.variant = 'hidden')

onMounted(() => {
  // Touch devices keep the native cursor.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  enabled.value = true
  document.documentElement.classList.add('has-custom-cursor')

  requestAnimationFrame(() => {
    if (!dot.value || !ring.value) return
    gsap.set([dot.value, ring.value], { xPercent: -50, yPercent: -50, x: -100, y: -100 })
    const inertia = prefersReducedMotion() ? 0.01 : 0.45
    moveDot = gsap.quickTo(dot.value, 'x', { duration: 0.05 })
    moveDotY = gsap.quickTo(dot.value, 'y', { duration: 0.05 })
    moveRing = gsap.quickTo(ring.value, 'x', { duration: inertia, ease: 'power3.out' })
    moveRingY = gsap.quickTo(ring.value, 'y', { duration: inertia, ease: 'power3.out' })
  })

  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerover', onOver, { passive: true })
  document.addEventListener('pointerdown', onDown)
  document.addEventListener('pointerup', onUp)
  document.documentElement.addEventListener('pointerleave', onLeave)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('has-custom-cursor')
  window.removeEventListener('pointermove', onMove)
  document.removeEventListener('pointerover', onOver)
  document.removeEventListener('pointerdown', onDown)
  document.removeEventListener('pointerup', onUp)
  document.documentElement.removeEventListener('pointerleave', onLeave)
})
</script>

<template>
  <div
    v-if="enabled"
    class="cursor"
    :class="[`is-${cursor.variant}`, { 'is-pressed': cursor.pressed }]"
    aria-hidden="true"
  >
    <div ref="ring" class="cursor__ring">
      <span class="cursor__label">{{ cursor.label }}</span>
    </div>
    <div ref="dot" class="cursor__dot"></div>
  </div>
</template>

<style scoped>
.cursor {
  position: fixed;
  inset: 0;
  z-index: var(--z-cursor);
  pointer-events: none;
}

.cursor__ring,
.cursor__dot {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
}

.cursor__ring {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1.5px solid #fff;
  border-radius: var(--radius-pill);
  mix-blend-mode: difference;
  transition:
    width var(--dur-base) var(--ease-out),
    height var(--dur-base) var(--ease-out),
    background-color var(--dur-fast) linear,
    border-color var(--dur-fast) linear,
    opacity var(--dur-fast) linear,
    scale var(--dur-fast) var(--ease-out);
}

.cursor__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-lime);
  transition: opacity var(--dur-fast) linear;
}

.cursor__label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink);
  opacity: 0;
  transition: opacity var(--dur-fast) linear;
}

.is-link .cursor__ring {
  width: 64px;
  height: 64px;
  background: #fff;
}

.is-project .cursor__ring {
  width: 96px;
  height: 96px;
  background: var(--color-lime);
  border-color: var(--color-lime);
  mix-blend-mode: normal;
}

.is-project .cursor__label {
  opacity: 1;
}

.is-text .cursor__ring {
  width: 3px;
  height: 40px;
  border-radius: 2px;
  background: #fff;
}

.is-hidden .cursor__ring,
.is-hidden .cursor__dot,
.is-text .cursor__dot {
  opacity: 0;
}

.is-pressed .cursor__ring {
  scale: 0.85;
}
</style>
