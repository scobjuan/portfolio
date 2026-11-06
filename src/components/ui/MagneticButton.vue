<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import { useMotion } from '@/composables/useMotion'

withDefaults(defineProps<{ href: string; strength?: number }>(), { strength: 24 })

const el = ref<HTMLElement | null>(null)

// The button drifts toward the cursor while hovered (fine pointers only).
useMotion(el, ({ motion, fine }) => {
  const node = el.value
  if (!motion || !fine || !node) return

  const x = gsap.quickTo(node, 'x', { duration: 0.6, ease: 'power3.out' })
  const y = gsap.quickTo(node, 'y', { duration: 0.6, ease: 'power3.out' })
  const max = Number(node.dataset.strength ?? 24)

  const onMove = (event: PointerEvent) => {
    const rect = node.getBoundingClientRect()
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    x(dx * max)
    y(dy * max)
  }
  const onLeave = () => {
    x(0)
    y(0)
  }

  node.addEventListener('pointermove', onMove)
  node.addEventListener('pointerleave', onLeave)
  return () => {
    node.removeEventListener('pointermove', onMove)
    node.removeEventListener('pointerleave', onLeave)
  }
})
</script>

<template>
  <a ref="el" class="magnetic" :href="href" :data-strength="strength">
    <slot />
  </a>
</template>

<style scoped>
.magnetic {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  will-change: transform;
}
</style>
