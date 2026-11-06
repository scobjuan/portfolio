<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { SECTIONS } from '@/router/routes'
import { lockScroll, unlockScroll } from '@/composables/useLenis'
import { activeSection } from '@/composables/useSectionTheme'
import { useMenu } from '@/composables/useMenu'

const menu = useMenu()
const route = useRoute()
const panel = ref<HTMLElement | null>(null)
let locked = false

const FOCUSABLE = 'a[href], button:not([disabled])'

function focusables(): HTMLElement[] {
  const inPanel = Array.from(panel.value?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])
  const trigger = menu.getTrigger()
  return trigger ? [trigger, ...inPanel] : inPanel
}

function onKeydown(event: KeyboardEvent) {
  if (!menu.state.open) return
  if (event.key === 'Escape') {
    menu.close()
    return
  }
  if (event.key !== 'Tab') return

  const items = focusables()
  const first = items[0]
  const last = items[items.length - 1]
  if (!first || !last) return

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => menu.state.open,
  async (open) => {
    if (open) {
      lockScroll()
      locked = true
      document.addEventListener('keydown', onKeydown)
      await nextTick()
      panel.value?.querySelector<HTMLElement>('a')?.focus()
    } else {
      document.removeEventListener('keydown', onKeydown)
      if (locked) unlockScroll()
      locked = false
      menu.getTrigger()?.focus()
    }
  },
)

// Navigating from the menu closes it.
watch(() => route.fullPath, menu.close)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  if (locked) unlockScroll()
})
</script>

<template>
  <div
    id="mobile-menu"
    ref="panel"
    class="menu"
    :class="{ 'is-open': menu.state.open }"
    :inert="!menu.state.open"
    role="dialog"
    aria-modal="true"
    aria-label="Menú de navegación"
  >
    <nav class="menu__nav" aria-label="Menú móvil">
      <RouterLink
        v-for="(section, index) in SECTIONS"
        :key="section.id"
        :to="section.path"
        class="menu__link"
        :style="{ '--i': index }"
        :aria-current="activeSection === section.id ? 'true' : undefined"
      >
        <span class="menu__index">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="menu__label">{{ section.label }}</span>
      </RouterLink>
    </nav>

    <div class="menu__footer">
      <a class="menu__mail" href="mailto:hola@tudominio.com">[hola@tudominio.com]</a>
    </div>
  </div>
</template>

<style scoped>
.menu {
  position: fixed;
  inset: 0;
  z-index: var(--z-menu);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 110px 20px 28px;
  background: var(--color-lime);
  color: var(--color-ink);
  clip-path: circle(0% at calc(100% - 64px) 44px);
  visibility: hidden;
  transition:
    clip-path 700ms var(--ease-curtain),
    visibility 0s linear 700ms;
}

.menu.is-open {
  clip-path: circle(150% at calc(100% - 64px) 44px);
  visibility: visible;
  transition:
    clip-path 700ms var(--ease-curtain),
    visibility 0s;
}

.menu__nav {
  display: flex;
  flex-direction: column;
}

.menu__link {
  display: flex;
  align-items: baseline;
  gap: 14px;
  min-height: 76px;
  border-bottom: 1.5px solid var(--color-ink);
  color: inherit;
  text-decoration: none;
  opacity: 0;
  translate: 0 24px;
  transition:
    opacity var(--dur-base) var(--ease-out),
    translate var(--dur-base) var(--ease-out);
}

.is-open .menu__link {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(200ms + var(--i) * 60ms);
}

.menu__index {
  font-family: var(--font-mono);
  font-size: 12px;
}

.menu__label {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: 46px;
  line-height: 76px;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.menu__footer {
  padding-top: 24px;
}

.menu__mail {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 22px;
  color: inherit;
  border-bottom: 2px solid var(--color-ink);
}

@media (min-width: 961px) {
  .menu {
    display: none;
  }
}
</style>
