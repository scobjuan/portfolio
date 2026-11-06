<script setup lang="ts">
defineProps<{ index: string; label: string }>()
</script>

<template>
  <span class="section-label">({{ index }}) {{ label }}</span>
</template>

<style scoped>
.section-label {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.7;
}
</style>
