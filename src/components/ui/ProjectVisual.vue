<script setup lang="ts">
withDefaults(defineProps<{ hue: number; label: string; ratio?: string }>(), { ratio: '16 / 10' })
</script>

<template>
  <div
    class="visual"
    :style="{ '--hue': hue, aspectRatio: ratio }"
    role="img"
    :aria-label="`${label} (imagen de ejemplo)`"
  >
    <span class="visual__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.visual {
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding: 16px;
  border-radius: var(--radius-card);
  background: repeating-linear-gradient(
    135deg,
    hsl(var(--hue) 42% 80%) 0 16px,
    hsl(var(--hue) 42% 74%) 16px 32px
  );
  color: #0e0e0c;
}

.visual__label {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
