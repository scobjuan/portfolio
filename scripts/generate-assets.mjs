// Generates the social preview image and icons in `public/` with the site fonts.
// Usage: pnpm assets   (needs Chromium: pnpm exec playwright install chromium)
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from '@playwright/test'

const root = resolve(import.meta.dirname, '..')
const font = (pkg, file) =>
  pathToFileURL(join(root, 'node_modules', '@fontsource-variable', pkg, 'files', file)).href

const faces = `
@font-face { font-family: Archivo; font-weight: 100 900; font-stretch: 62% 125%;
  src: url(${font('archivo', 'archivo-latin-wdth-normal.woff2')}) format('woff2-variations'); }
@font-face { font-family: Inter; font-weight: 100 900;
  src: url(${font('inter', 'inter-latin-wght-normal.woff2')}) format('woff2-variations'); }
@font-face { font-family: Mono; font-weight: 100 800;
  src: url(${font('jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2')}) format('woff2-variations'); }`

const INK = '#0e0e0c'
const BONE = '#ede9e2'
const LIME = '#d4ff3a'

const ogHtml = `<style>${faces}
  * { box-sizing: border-box; margin: 0 }
  body { width: 1200px; height: 630px; background: ${INK}; color: ${BONE}; padding: 56px 64px;
    display: flex; flex-direction: column; justify-content: space-between; overflow: hidden }
  .row { display: flex; justify-content: space-between; align-items: center;
    font: 500 20px Mono; letter-spacing: .1em; text-transform: uppercase; color: #8a877f }
  .row b { color: ${LIME}; font-weight: 500 }
  h1 { font: 900 166px/.86 Archivo; font-stretch: 125%; letter-spacing: -.045em; text-transform: uppercase }
  h1 span { display: block } h1 span + span { text-align: right }
  p { font: 500 30px Inter; color: ${BONE} } p i { color: ${LIME}; font-style: normal }
</style>
<div class="row"><span>Portafolio 2026</span><b>● Disponible</b></div>
<h1><span>Juan</span><span>Escobar</span></h1>
<p>Desarrollador web · <i>JavaScript</i> y <i>Vue 3</i></p>`

const iconHtml = (size) => `<style>${faces}
  * { margin: 0 } body { width: ${size}px; height: ${size}px; background: ${INK}; position: relative; overflow: hidden }
  span { position: absolute; inset: 0; display: grid; place-items: center; color: ${BONE};
    font: 900 ${size * 0.5}px Archivo; font-stretch: 125%; letter-spacing: -.05em; padding-bottom: ${size * 0.04}px }
  i { position: absolute; right: ${size * 0.2}px; bottom: ${size * 0.2}px; width: ${size * 0.09}px; height: ${size * 0.09}px;
    border-radius: 50%; background: ${LIME} }
</style><span>JE</span><i></i>`

const dir = mkdtempSync(join(tmpdir(), 'portfolio-assets-'))
const browser = await chromium.launch()

async function render(html, width, height, out) {
  const file = join(dir, `${out.replace(/\W/g, '_')}.html`)
  writeFileSync(file, html)
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(pathToFileURL(file).href)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: join(root, 'public', out) })
  await page.close()
  console.log('wrote public/' + out)
}

await render(ogHtml, 1200, 630, 'og-image.png')
await render(iconHtml(180), 180, 180, 'apple-touch-icon.png')
await render(iconHtml(512), 512, 512, 'icon-512.png')
await browser.close()

writeFileSync(
  join(root, 'public', 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${INK}"/><text x="30" y="43" font-family="Archivo, Arial Black, Arial, sans-serif" font-weight="900" font-size="30" text-anchor="middle" fill="${BONE}" letter-spacing="-2">JE</text><circle cx="52" cy="47" r="4.5" fill="${LIME}"/></svg>\n`,
)
console.log('wrote public/favicon.svg')
