import gsap from 'gsap'

/**
 * Turns the Skills pills into matter.js bodies: they fall into a pile and can be
 * dragged and thrown. The DOM pills stay the source of truth for content and size;
 * only their transform is driven by the simulation.
 *
 * Loaded with a dynamic import when the section is reached, never on touch devices
 * or with reduced motion. Returns a function that restores the static layout.
 */
export async function mountSkillsPhysics(
  container: HTMLElement,
  pills: HTMLElement[],
): Promise<() => void> {
  const Matter = (await import('matter-js')).default
  const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint } = Matter

  // Switch the layout first so the container is measured in its physics size.
  container.classList.add('is-physics')

  const engine = Engine.create({
    enableSleeping: true,
    positionIterations: 10,
    velocityIterations: 8,
    gravity: { x: 0, y: 1.2, scale: 0.001 },
  })
  const WALL = 200
  let width = container.clientWidth
  let height = container.clientHeight
  let walls: Matter.Body[] = []

  const buildWalls = () => {
    if (walls.length) Composite.remove(engine.world, walls)
    const opts = { isStatic: true, friction: 0.4 }
    walls = [
      Bodies.rectangle(width / 2, height + WALL / 2, width + WALL * 2, WALL, opts),
      Bodies.rectangle(-WALL / 2, height / 2 - height, WALL, height * 3, opts),
      Bodies.rectangle(width + WALL / 2, height / 2 - height, WALL, height * 3, opts),
      // Ceiling far above, so a hard throw cannot lose a pill.
      Bodies.rectangle(width / 2, -height * 2, width + WALL * 2, WALL, opts),
    ]
    Composite.add(engine.world, walls)
  }
  buildWalls()

  const entries = pills.map((el) => {
    const w = el.offsetWidth
    const h = el.offsetHeight
    const body = Bodies.rectangle(0, 0, w, h, {
      chamfer: { radius: h / 2 },
      restitution: 0.35,
      friction: 0.3,
      frictionAir: 0.01,
      density: 0.002,
    })
    return { el, body, w, h, added: false }
  })

  // Pills enter one after another from above the clipped container.
  const spawn = gsap.timeline()
  entries.forEach((entry, index) => {
    spawn.call(
      () => {
        const margin = entry.w / 2 + 8
        const x = gsap.utils.random(margin, Math.max(margin + 1, width - margin))
        Body.setPosition(entry.body, { x, y: -entry.h })
        Body.setAngle(entry.body, gsap.utils.random(-0.6, 0.6))
        Composite.add(engine.world, entry.body)
        entry.added = true
        entry.el.style.opacity = '1'
      },
      undefined,
      index * 0.07,
    )
  })

  // Dragging and throwing. matter's wheel handler calls preventDefault, which would
  // block Lenis, so it is detached.
  const mouse = Mouse.create(container)
  const wheel = (mouse as unknown as { mousewheel: EventListener }).mousewheel
  container.removeEventListener('wheel', wheel)
  container.removeEventListener('mousewheel', wheel)
  container.removeEventListener('DOMMouseScroll', wheel)
  const drag = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, damping: 0.1, render: { visible: false } },
  })
  Composite.add(engine.world, drag)

  const draw = () => {
    for (const { el, body, w, h, added } of entries) {
      if (!added) continue
      const x = body.position.x - w / 2
      const y = body.position.y - h / 2
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${body.angle.toFixed(4)}rad)`
    }
  }

  const tick = (_time: number, deltaTime: number) => {
    Engine.update(engine, Math.min(deltaTime, 33))
    draw()
  }

  // Simulate only while the section is on screen.
  const resume = () => gsap.ticker.add(tick)
  const pause = () => gsap.ticker.remove(tick)
  const observer = new IntersectionObserver(([entry]) =>
    entry?.isIntersecting ? resume() : pause(),
  )
  observer.observe(container)

  const resize = new ResizeObserver(() => {
    const nextWidth = container.clientWidth
    const nextHeight = container.clientHeight
    if (nextWidth === width && nextHeight === height) return
    width = nextWidth
    height = nextHeight
    buildWalls()
    for (const { body, added } of entries) {
      if (!added) continue
      const { x, y } = body.position
      if (x > width || x < 0 || y > height) {
        Body.setPosition(body, { x: gsap.utils.clamp(40, Math.max(41, width - 40), x), y: 0 })
      }
    }
  })
  resize.observe(container)

  return () => {
    spawn.kill()
    pause()
    observer.disconnect()
    resize.disconnect()
    Mouse.clearSourceEvents(mouse)
    Composite.clear(engine.world, false)
    Engine.clear(engine)
    container.classList.remove('is-physics')
    for (const { el } of entries) {
      el.style.transform = ''
      el.style.opacity = ''
    }
  }
}
