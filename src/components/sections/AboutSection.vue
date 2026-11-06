<script setup lang="ts">
import { ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import SectionLabel from '@/components/ui/SectionLabel.vue'
import { profile } from '@/content/profile'
import { EASE_OUT, useMotion } from '@/composables/useMotion'
import { countUp, formatCount } from '@/utils/text-effects'

const root = ref<HTMLElement | null>(null)
const photo = ref<HTMLElement | null>(null)
const text = ref<HTMLElement | null>(null)
const seal = ref<HTMLElement | null>(null)

useMotion(root, ({ motion, fine }) => {
  const section = root.value
  if (!motion || !section) return

  // Photo: unmask from the bottom while the image settles from a slight zoom.
  if (photo.value) {
    const image = photo.value.querySelector('.about__image')
    gsap.set(photo.value, { clipPath: 'inset(100% 0 0 0)' })
    gsap.set(image, { scale: 1.15 })
    ScrollTrigger.create({
      trigger: photo.value,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(photo.value, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut' })
        gsap.to(image, { scale: 1, duration: 1.8, ease: EASE_OUT })
      },
    })
  }

  // Statement: words light up one by one as the visitor scrolls.
  if (text.value) {
    SplitText.create(text.value, {
      type: 'words',
      aria: 'none',
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: 0.18 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.1,
            scrollTrigger: {
              trigger: text.value,
              start: 'top 80%',
              end: 'bottom 50%',
              scrub: true,
            },
          },
        ),
    })
  }

  // Figures count up when they enter.
  gsap.utils.toArray<HTMLElement>('[data-count]', section).forEach((el) => {
    const value = Number(el.dataset.count)
    const suffix = el.dataset.suffix ?? ''
    el.textContent = formatCount(0, suffix)
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => countUp(el, value, suffix),
    })
  })

  // Seal: constant slow spin that speeds up under the pointer.
  if (seal.value) {
    const spin = gsap.to(seal.value, { rotation: 360, duration: 14, ease: 'none', repeat: -1 })
    if (fine) {
      const faster = () => gsap.to(spin, { timeScale: 4, duration: 0.6 })
      const normal = () => gsap.to(spin, { timeScale: 1, duration: 0.8 })
      seal.value.addEventListener('pointerenter', faster)
      seal.value.addEventListener('pointerleave', normal)
    }
  }
})
</script>

<template>
  <section id="about" ref="root" class="about" data-theme="bone">
    <div class="about__media">
      <SectionLabel index="03" label="Sobre mí" />
      <div ref="photo" class="about__photo">
        <div
          class="about__image"
          role="img"
          aria-label="Retrato de Juan Escobar (imagen de ejemplo)"
        >
          <span class="about__caption">[Retrato · duotono, a color al pasar el cursor]</span>
        </div>
      </div>
      <div ref="seal" class="about__seal" aria-hidden="true">
        <svg viewBox="0 0 128 128" width="128" height="128">
          <defs>
            <path id="seal-circle" d="M64,64 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <text class="about__seal-text">
            <textPath href="#seal-circle">Disponible para proyectos · Disponible ·</textPath>
          </text>
        </svg>
      </div>
    </div>

    <div class="about__content">
      <p ref="text" class="about__statement">{{ profile.about }}</p>

      <div class="about__facts">
        <div v-for="stat in profile.stats" :key="stat.label" class="about__stat">
          <span class="about__number" :data-count="stat.value" :data-suffix="stat.suffix"
            >{{ stat.value }}{{ stat.suffix }}</span
          >
          <span class="about__label">{{ stat.label }}</span>
        </div>
        <div class="about__stat about__stat--text">
          <p>Base en {{ profile.location }}. Trabajo en remoto, en español e inglés.</p>
          <RouterLink class="about__link" to="/experiencia">Ver experiencia ↓</RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  display: grid;
  grid-template-columns: minmax(280px, 400px) 1fr;
  gap: 64px;
  min-height: 100svh;
  padding: 140px var(--grid-margin) 80px;
}

.about__media,
.about__content {
  min-width: 0;
}

.about__media {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.about__photo {
  flex: 1;
  min-height: 420px;
  overflow: hidden;
  border-radius: var(--radius-card);
}

.about__image {
  display: flex;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  padding: 18px;
  background: repeating-linear-gradient(0deg, #1a1a17 0 2px, #0e0e0c 2px 6px);
  color: var(--color-bone);
  filter: grayscale(1);
  transition: filter var(--dur-slow) var(--ease-out);
}

.about__photo:hover .about__image {
  filter: grayscale(0) hue-rotate(20deg);
}

.about__caption {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.about__seal {
  position: absolute;
  top: 56px;
  right: -44px;
  display: grid;
  place-items: center;
  width: 128px;
  height: 128px;
  border-radius: 50%;
  background: var(--color-lime);
  color: var(--color-ink);
}

.about__seal-text {
  fill: currentColor;
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
}

.about__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 48px;
  padding-top: 30px;
}

.about__statement {
  font-family: var(--font-display);
  font-weight: 700;
  font-stretch: 100%;
  font-size: clamp(28px, 3.8vw, 52px);
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.about__facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--fg);
}

.about__stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.about__number {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 125%;
  font-size: clamp(36px, 4.4vw, 56px);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.about__label,
.about__link {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.about__stat--text p {
  font-size: 18px;
  line-height: 1.45;
}

.about__link {
  align-self: flex-start;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  color: inherit;
}

@media (max-width: 960px) {
  .about {
    grid-template-columns: 1fr;
    gap: 48px;
    padding-inline: 20px;
  }

  .about__photo {
    min-height: 320px;
  }

  .about__seal {
    right: 12px;
  }

  .about__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .about__stat--text {
    grid-column: 1 / -1;
  }
}
</style>
