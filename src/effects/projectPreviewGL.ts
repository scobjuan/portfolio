import gsap from 'gsap'
import type { Project } from '@/content/types'

export interface PreviewGL {
  /** Cross-fades to the given project with a distortion burst. */
  setProject: (project: Pick<Project, 'slug' | 'title' | 'hue'>) => void
  /** Pointer speed in pixels per frame; drives the wave and the RGB split. */
  setVelocity: (speed: number) => void
  /** Renders only while the preview is visible. */
  setActive: (active: boolean) => void
  destroy: () => void
}

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uFrom;
  uniform sampler2D uTo;
  uniform float uMix;
  uniform float uVelocity;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    // Distortion grows with pointer speed and peaks halfway through a swap.
    float burst = sin(uMix * 3.14159265);
    float amount = clamp(uVelocity * 0.012, 0.0, 0.05) + burst * 0.06;

    vec2 uv = vUv;
    uv.x += sin(uv.y * 9.0 + uTime * 3.0) * amount;
    uv.y += sin(uv.x * 7.0 - uTime * 2.0) * amount * 0.6;

    vec2 split = vec2(amount * 0.5, 0.0);
    vec4 a = vec4(
      texture2D(uFrom, uv + split).r,
      texture2D(uFrom, uv).g,
      texture2D(uFrom, uv - split).b,
      1.0
    );
    vec4 b = vec4(
      texture2D(uTo, uv + split).r,
      texture2D(uTo, uv).g,
      texture2D(uTo, uv - split).b,
      1.0
    );
    gl_FragColor = mix(a, b, smoothstep(0.0, 1.0, uMix));
  }
`

/** Draws the placeholder card (hue stripes, label, title) until real images exist. */
function drawCard(project: Pick<Project, 'title' | 'hue'>, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const stripe = 28
  for (let x = -height; x < width + height; x += stripe * 2) {
    ctx.fillStyle = `hsl(${project.hue} 35% 22%)`
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + stripe, 0)
    ctx.lineTo(x + stripe - height, height)
    ctx.lineTo(x - height, height)
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalCompositeOperation = 'destination-over'
  ctx.fillStyle = `hsl(${project.hue} 35% 17%)`
  ctx.fillRect(0, 0, width, height)
  ctx.globalCompositeOperation = 'source-over'

  ctx.fillStyle = '#fff'
  ctx.font = '22px "JetBrains Mono Variable", monospace'
  ctx.textBaseline = 'top'
  ctx.fillText('[CAPTURA DEL PROYECTO · 16:10]', 32, 32)
  ctx.font = '800 56px "Archivo Variable", sans-serif'
  ctx.textBaseline = 'bottom'
  ctx.fillText(project.title.toUpperCase(), 32, height - 32, width - 64)
  return canvas
}

/**
 * Mounts an OGL canvas inside the project preview box. Throws if WebGL is not
 * available; the caller keeps the CSS placeholder in that case.
 */
export async function mountProjectPreviewGL(box: HTMLElement): Promise<PreviewGL> {
  const { Renderer, Program, Mesh, Triangle, Texture } = await import('ogl')

  const renderer = new Renderer({ alpha: false, dpr: Math.min(window.devicePixelRatio, 1.5) })
  const gl = renderer.gl
  const canvas = gl.canvas as HTMLCanvasElement
  canvas.className = 'preview__canvas'
  canvas.setAttribute('aria-hidden', 'true')
  box.prepend(canvas)

  const size = () => renderer.setSize(box.clientWidth, box.clientHeight)
  size()
  const resize = new ResizeObserver(size)
  resize.observe(box)

  const textures = new Map<string, InstanceType<typeof Texture>>()
  const textureFor = (project: Pick<Project, 'slug' | 'title' | 'hue'>) => {
    let texture = textures.get(project.slug)
    if (!texture) {
      texture = new Texture(gl, { image: drawCard(project, 680, 440), generateMipmaps: false })
      textures.set(project.slug, texture)
    }
    return texture
  }

  const blank = textureFor({ slug: '', title: '', hue: 72 })
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uFrom: { value: blank },
      uTo: { value: blank },
      uMix: { value: 1 },
      uVelocity: { value: 0 },
      uTime: { value: 0 },
    },
  })
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

  let velocity = 0
  let current = ''
  const mix = { value: 1 }

  const render = (time: number) => {
    // Velocity eases back to rest between pointer events.
    velocity *= 0.9
    program.uniforms.uVelocity!.value = velocity
    program.uniforms.uMix!.value = mix.value
    program.uniforms.uTime!.value = time
    renderer.render({ scene: mesh })
  }
  const tick = (time: number) => render(time)

  return {
    setProject(project) {
      if (project.slug === current) return
      const next = textureFor(project)
      // First project shows immediately; later ones cross-fade from the current one.
      program.uniforms.uFrom!.value = current ? program.uniforms.uTo!.value : next
      program.uniforms.uTo!.value = next
      current = project.slug
      gsap.killTweensOf(mix)
      mix.value = 0
      gsap.to(mix, { value: 1, duration: 0.7, ease: 'power2.inOut' })
    },
    setVelocity(speed) {
      velocity = Math.max(velocity, Math.abs(speed))
    },
    setActive(active) {
      if (active) gsap.ticker.add(tick)
      else gsap.ticker.remove(tick)
    },
    destroy() {
      gsap.ticker.remove(tick)
      gsap.killTweensOf(mix)
      resize.disconnect()
      textures.forEach((texture) => gl.deleteTexture(texture.texture))
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    },
  }
}
