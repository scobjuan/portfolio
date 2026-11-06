<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { registerCurtain } from '@/composables/usePageTransition'

const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const label = ref<HTMLElement | null>(null)
const sub = ref<HTMLElement | null>(null)

onMounted(() => {
  if (root.value && panel.value && label.value && sub.value) {
    registerCurtain({ root: root.value, panel: panel.value, label: label.value, sub: sub.value })
  }
})
onBeforeUnmount(() => registerCurtain(null))
</script>

<template>
  <div ref="root" class="curtain" aria-hidden="true">
    <div ref="panel" class="curtain__panel"></div>
    <div class="curtain__text">
      <span ref="sub" class="curtain__sub"></span>
      <span ref="label" class="curtain__label"></span>
    </div>
  </div>
</template>

<style scoped>
.curtain {
  position: fixed;
  inset: 0;
  z-index: var(--z-curtain);
  overflow: hidden;
  pointer-events: none;
  visibility: hidden;
}

.curtain__panel {
  --rt: 0px;
  --rb: 0px;
  position: absolute;
  inset: 0 0 auto;
  /* Taller than the screen so the curved bottom edge is visible while it leaves. */
  height: calc(100% + 15vh);
  border-radius: 50% 50% 50% 50% / var(--rt) var(--rt) var(--rb) var(--rb);
  will-change: transform;
}

.curtain__text {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 var(--grid-margin);
  text-align: center;
}

.curtain__sub {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
}

.curtain__label {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(32px, 8vw, 120px);
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
</style>
