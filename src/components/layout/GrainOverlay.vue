<script setup lang="ts"></script>

<template>
  <div class="grain" aria-hidden="true"></div>
</template>

<style scoped>
.grain {
  position: fixed;
  inset: -50%;
  z-index: var(--z-grain);
  pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  animation: grain 1s steps(6) infinite;
}

@keyframes grain {
  0% {
    transform: translate(0, 0);
  }
  20% {
    transform: translate(-3%, 2%);
  }
  40% {
    transform: translate(2%, -3%);
  }
  60% {
    transform: translate(-2%, -1%);
  }
  80% {
    transform: translate(3%, 3%);
  }
  100% {
    transform: translate(0, 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .grain {
    animation: none;
  }
}
</style>
