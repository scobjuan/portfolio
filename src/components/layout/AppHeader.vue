<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { SECTIONS } from '@/router/routes'
import { activeSection } from '@/composables/useSectionTheme'
import { useMenu } from '@/composables/useMenu'

const menu = useMenu()
const route = useRoute()

/** A section is highlighted when scrolled to, or when a child page of it is open. */
const isActive = (id: string) =>
  route.meta.parentSection ? route.meta.parentSection === id : activeSection.value === id
const toggle = ref<HTMLButtonElement | null>(null)
const navSections = SECTIONS.filter((section) => section.id !== 'home')

onMounted(() => menu.registerTrigger(toggle.value))
</script>

<template>
  <header class="header" :class="{ 'is-menu-open': menu.state.open }">
    <RouterLink class="header__logo" to="/">
      JE<span class="header__dot">.</span><span class="sr-only"> Juan Escobar, ir al inicio</span>
    </RouterLink>

    <nav class="header__nav" aria-label="Principal">
      <RouterLink
        v-for="(section, index) in navSections"
        :key="section.id"
        :to="section.path"
        class="header__link"
        :aria-current="isActive(section.id) ? 'true' : undefined"
        :class="{ 'is-active': isActive(section.id) }"
      >
        <span class="header__index">{{ String(index + 1).padStart(2, '0') }}</span>
        {{ section.label }}
      </RouterLink>
    </nav>

    <span class="header__status">
      <span class="header__pulse" aria-hidden="true"></span>
      Disponible
    </span>

    <button
      ref="toggle"
      type="button"
      class="header__toggle"
      :aria-expanded="menu.state.open"
      aria-controls="mobile-menu"
      @click="menu.toggle"
    >
      {{ menu.state.open ? 'Cerrar' : 'Menú' }}
      <svg
        aria-hidden="true"
        width="18"
        height="10"
        viewBox="0 0 18 10"
        fill="none"
        stroke="currentColor"
        stroke-width="1.6"
      >
        <template v-if="menu.state.open">
          <line x1="3" y1="0" x2="15" y2="10" />
          <line x1="15" y1="0" x2="3" y2="10" />
        </template>
        <template v-else>
          <line x1="0" y1="1" x2="18" y2="1" />
          <line x1="6" y1="9" x2="18" y2="9" />
        </template>
      </svg>
    </button>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset: 0 0 auto;
  z-index: var(--z-header);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px var(--grid-margin);
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--fg);
  transition: color var(--dur-base) var(--ease-out);
}

.header.is-menu-open {
  color: var(--color-ink);
  --accent: var(--color-ink);
}

.header a {
  color: inherit;
  text-decoration: none;
}

.header__logo {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: 22px;
  letter-spacing: -0.02em;
}

.header__dot {
  color: var(--accent);
  transition: color var(--dur-base) var(--ease-out);
}

.header__nav {
  display: flex;
  gap: 28px;
}

.header__link {
  position: relative;
  padding: 8px 0;
}

.header__link::after {
  content: '';
  position: absolute;
  inset: auto 0 2px;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--dur-base) var(--ease-out);
}

.header__link:hover::after,
.header__link.is-active::after {
  transform: scaleX(1);
  transform-origin: left;
}

.header__index {
  opacity: 0.6;
}

.header__status {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
  border-radius: var(--radius-pill);
}

.header__pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 2s var(--ease-out) infinite;
}

.header__toggle {
  display: none;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
  border-radius: var(--radius-pill);
  background: transparent;
  font: inherit;
  letter-spacing: inherit;
  text-transform: inherit;
  cursor: pointer;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

@media (max-width: 960px) {
  .header {
    padding: 22px 20px;
  }

  .header__nav,
  .header__status {
    display: none;
  }

  .header__toggle {
    display: inline-flex;
  }
}
</style>
