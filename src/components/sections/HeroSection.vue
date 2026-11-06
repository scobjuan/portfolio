<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import MarqueeStrip from '@/components/ui/MarqueeStrip.vue'
import { profile } from '@/content/profile'
import { onPageReady } from '@/composables/usePageTransition'
import { EASE_OUT, useMotion } from '@/composables/useMotion'

const root = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)
const orb = ref<HTMLElement | null>(null)
const time = ref('')

const BASE_STRETCH = 100
const MAX_STRETCH = 125
const REACH = 260

let clock: ReturnType<typeof setInterval> | undefined

function updateTime() {
  time.value = new Intl.DateTimeFormat('es', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: profile.timeZone,
  }).format(new Date())
}

onMounted(() => {
  updateTime()
  clock = setInterval(updateTime, 30_000)
})
onBeforeUnmount(() => clearInterval(clock))

useMotion(root, ({ motion, fine }, ctx) => {
  const heading = title.value
  const section = root.value
  if (!motion || !heading || !section) return

  let intro: gsap.core.Tween | undefined
  let split: SplitText | undefined
  let chars: HTMLElement[] = []
  let started = false
  let disposed = false
  // Resting centre of every letter, in page coordinates (stable while letters stretch).
  let centres: Array<{ x: number; y: number }> = []

  const measure = () => {
    centres = chars.map((char) => {
      const rect = char.getBoundingClientRect()
      return {
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY,
      }
    })
  }

  const rest = gsap.from('[data-hero-fade]', {
    opacity: 0,
    y: 24,
    duration: 1,
    stagger: 0.1,
    delay: 0.5,
    ease: EASE_OUT,
    paused: true,
  })

  // Split once fonts are in so letter metrics are final.
  const build = () => {
    if (disposed) return
    // `aria: 'none'`: the h1 carries its own label (aria-label on spans is not allowed).
    split = SplitText.create(heading.querySelectorAll('.hero__line'), {
      type: 'chars',
      aria: 'none',
      charsClass: 'hero__char',
    })
    chars = split.chars as HTMLElement[]
    measure()
    intro = gsap.from(chars, {
      yPercent: 115,
      duration: 1.1,
      stagger: 0.04,
      ease: EASE_OUT,
      paused: true,
    })
    heading.style.visibility = 'visible'
    if (started) intro.play()
  }
  document.fonts.ready.then(() => ctx.add(build))

  const start = () => {
    started = true
    intro?.play()
    rest.play()
  }
  const stopWatch = onPageReady(start)

  // Letters widen as the pointer gets close; the orb follows with inertia.
  let cleanupPointer = () => {}
  if (fine) {
    const pointer = { x: -9999, y: -9999, inside: false }
    const widths = new WeakMap<HTMLElement, number>()

    const orbX = gsap.quickTo(orb.value, 'x', { duration: 0.7, ease: 'power3.out' })
    const orbY = gsap.quickTo(orb.value, 'y', { duration: 0.7, ease: 'power3.out' })

    const onMove = (event: PointerEvent) => {
      pointer.x = event.clientX + window.scrollX
      pointer.y = event.clientY + window.scrollY
      const rect = section.getBoundingClientRect()
      orbX(event.clientX - rect.left)
      orbY(event.clientY - rect.top)
    }
    const onEnter = () => {
      pointer.inside = true
      gsap.to(orb.value, { autoAlpha: 1, scale: 1, duration: 0.5, ease: EASE_OUT })
    }
    const onLeave = () => {
      pointer.inside = false
      gsap.to(orb.value, { autoAlpha: 0, scale: 0.6, duration: 0.5, ease: EASE_OUT })
    }
    const tick = () => {
      chars.forEach((char, index) => {
        const centre = centres[index]
        if (!centre) return
        const distance = Math.hypot(pointer.x - centre.x, pointer.y - centre.y)
        const closeness = pointer.inside ? Math.max(0, 1 - distance / REACH) : 0
        const target = BASE_STRETCH + (MAX_STRETCH - BASE_STRETCH) * closeness
        const current = widths.get(char) ?? BASE_STRETCH
        const next = current + (target - current) * 0.14
        if (Math.abs(next - current) > 0.05) {
          widths.set(char, next)
          char.style.fontStretch = `${next.toFixed(1)}%`
        }
      })
    }

    gsap.set(orb.value, { autoAlpha: 0, scale: 0.6 })
    section.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerenter', onEnter)
    section.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', measure)
    gsap.ticker.add(tick)
    cleanupPointer = () => {
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerenter', onEnter)
      section.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', measure)
      gsap.ticker.remove(tick)
    }
  }

  return () => {
    disposed = true
    stopWatch()
    cleanupPointer()
    split?.revert()
    heading.style.visibility = ''
  }
})
</script>

<template>
  <section id="home" ref="root" class="hero" data-theme="ink">
    <div ref="orb" class="hero__orb" aria-hidden="true"></div>

    <div class="hero__body">
      <div class="hero__row">
        <h1 ref="title" class="hero__title" :aria-label="profile.name">
          <span class="hero__line">{{ profile.firstName }}</span
          >{{ ' ' }}<span class="hero__line hero__line--end">{{ profile.lastName }}</span>
        </h1>
      </div>

      <div class="hero__meta">
        <div class="hero__info" data-hero-fade>
          <span class="hero__eyebrow">(Rol)</span>
          <p class="hero__role">
            {{ profile.role }}. Construyo interfaces vivas con
            <span class="hero__accent">JavaScript</span> y <span class="hero__accent">Vue 3</span>.
          </p>
        </div>
        <div class="hero__place" data-hero-fade>
          <span>{{ profile.location }}</span>
          <span>Hora local {{ time || '--:--' }}</span>
        </div>
      </div>
    </div>

    <div class="hero__foot" data-hero-fade>
      <span class="hero__scroll">
        <svg
          aria-hidden="true"
          width="14"
          height="20"
          viewBox="0 0 14 20"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <rect x="1" y="1" width="12" height="18" rx="6" />
          <line x1="7" y1="5" x2="7" y2="9" />
        </svg>
        Desliza para explorar
      </span>
      <code class="hero__code">const visitante = ref(true)</code>
      <span>© 2026</span>
    </div>

    <MarqueeStrip :items="profile.marquee" data-hero-fade />
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100svh;
  overflow: clip;
}

.hero__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
  padding: 120px var(--grid-margin) 24px;
}

.hero__title {
  font-family: var(--font-display);
  font-weight: 900;
  font-stretch: 100%;
  font-size: clamp(64px, 14vw, 220px);
  line-height: 0.86;
  letter-spacing: -0.045em;
  text-transform: uppercase;
}

.hero__line {
  display: block;
  /* Clip vertically for the letter reveal, but never cut stretched letters sideways. */
  padding-block: 0.06em;
  margin-block: -0.06em;
  clip-path: inset(0 -100vmax);
}

/* With motion allowed the title stays hidden until its letters are split and ready. */
@media (prefers-reduced-motion: no-preference) {
  :global(html.js .hero__title) {
    visibility: hidden;
  }
}

.hero__line--end {
  text-align: right;
}

.hero__meta {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
}

.hero__info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
}

.hero__eyebrow,
.hero__place,
.hero__foot {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero__eyebrow,
.hero__place {
  color: var(--color-ash);
}

.hero__role {
  font-size: 20px;
  line-height: 1.35;
}

.hero__accent {
  color: var(--accent);
}

.hero__place {
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: right;
}

.hero__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 var(--grid-margin) 18px;
  color: var(--color-ash);
}

.hero__scroll {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.hero__code {
  color: var(--accent);
}

.hero__orb {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 50%;
  background: var(--color-lime);
  mix-blend-mode: difference;
  pointer-events: none;
}

@media (max-width: 960px) {
  .hero__body {
    padding-inline: 20px;
  }

  .hero__foot {
    padding-inline: 20px;
  }

  .hero__meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero__place {
    text-align: left;
  }

  .hero__code {
    display: none;
  }
}

@media (hover: none) {
  .hero__orb {
    display: none;
  }
}
</style>
