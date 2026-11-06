<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import gsap from 'gsap'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import { profile } from '@/content/profile'
import { useMotion } from '@/composables/useMotion'
import { scrambleText } from '@/utils/text-effects'

const root = ref<HTMLElement | null>(null)
const heading = ref<HTMLElement | null>(null)
const mail = ref<HTMLElement | null>(null)
const status = ref('')
const social = profile.social.filter((link) => !link.href.startsWith('mailto:'))

let resetTimer: ReturnType<typeof setTimeout> | undefined
onBeforeUnmount(() => clearTimeout(resetTimer))

async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email)
  } catch {
    // Without clipboard access, open the mail client instead.
    window.location.href = `mailto:${profile.email}`
    return
  }
  status.value = 'Correo copiado al portapapeles'
  if (!mail.value) return
  scrambleText(mail.value, '¡Copiado!', 0.5)
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    if (mail.value) scrambleText(mail.value, profile.email, 0.6)
    status.value = ''
  }, 1800)
}

// The heading stretches from condensed to extended as the section arrives.
useMotion(root, ({ motion }) => {
  if (!motion || !heading.value) return
  gsap.fromTo(
    heading.value,
    { fontStretch: '62%' },
    {
      fontStretch: '125%',
      ease: 'none',
      scrollTrigger: { trigger: root.value, start: 'top 80%', end: 'top 10%', scrub: true },
    },
  )
})
</script>

<template>
  <section id="contact" ref="root" class="contact" data-theme="lime">
    <div class="contact__top">
      <span>(06) Contacto</span>
      <span>Respondo en menos de 48 h</span>
    </div>

    <h2 ref="heading" class="contact__title">¿Hablamos?</h2>

    <div class="contact__actions">
      <div class="contact__mail">
        <span class="contact__hint">Escríbeme · clic para copiar</span>
        <button type="button" class="contact__copy" @click="copyEmail">
          <span ref="mail">{{ profile.email }}</span>
        </button>
        <span class="sr-only" role="status">{{ status }}</span>
      </div>

      <MagneticButton class="contact__cta" :href="`mailto:${profile.email}`">
        <svg
          aria-hidden="true"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
        >
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
        Empecemos
      </MagneticButton>
    </div>

    <footer class="contact__foot">
      <nav class="contact__social" aria-label="Redes">
        <a
          v-for="link in social"
          :key="link.label"
          class="social"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="social__label">{{ link.label }}</span>
          <span class="social__arrow" aria-hidden="true">↗</span>
        </a>
      </nav>
      <span class="contact__legal">© 2026 {{ profile.name }} · Hecho con Vue 3</span>
      <RouterLink class="contact__top-link" to="/">Volver arriba ↑</RouterLink>
    </footer>
  </section>
</template>

<style scoped>
.contact {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  min-height: 100svh;
  padding: 120px var(--grid-margin) 32px;
}

.contact__top,
.contact__hint,
.contact__foot,
.contact__cta {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.contact__top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.contact__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(40px, 10.5vw, 170px);
  line-height: 0.86;
  letter-spacing: -0.05em;
  text-transform: uppercase;
}

.contact__actions {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.contact__mail {
  min-width: 0;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact__copy {
  padding: 0 0 4px;
  border: 0;
  border-bottom: 4px solid currentColor;
  background: transparent;
  color: inherit;
  font-family: var(--font-display);
  font-weight: 800;
  font-stretch: 110%;
  font-size: clamp(18px, 5vw, 48px);
  max-width: 100%;
  overflow-wrap: anywhere;
  letter-spacing: -0.02em;
  text-align: left;
  cursor: pointer;
  transition: color var(--dur-fast) linear;
}

.contact__copy:hover {
  color: var(--accent);
}

.contact__cta {
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: var(--color-ink);
  color: var(--color-lime);
  text-decoration: none;
}

.contact__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 18px;
  border-top: 1.5px solid currentColor;
}

.contact__foot a {
  color: inherit;
  text-decoration: none;
}

.contact__social {
  display: flex;
  gap: 28px;
}

.social {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 44px;
}

.social__label {
  background: linear-gradient(currentColor, currentColor) left bottom / 0% 1px no-repeat;
  transition: background-size var(--dur-base) var(--ease-out);
}

.social:hover .social__label,
.social:focus-visible .social__label {
  background-size: 100% 1px;
}

.social__arrow {
  display: inline-block;
  transition: rotate var(--dur-base) var(--ease-out);
}

.social:hover .social__arrow,
.social:focus-visible .social__arrow {
  rotate: 45deg;
}

.contact__top-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}

@media (max-width: 960px) {
  .contact {
    padding-inline: 20px;
  }

  .contact__cta {
    width: 130px;
    height: 130px;
  }
}
</style>
