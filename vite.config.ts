/// <reference types="vite-ssg" />
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import type { HtmlTagDescriptor, Plugin } from 'vite'
import { mkdirSync, writeFileSync } from 'node:fs'
import { projects } from './src/content/projects.ts'
import { normalizeSiteUrl } from './src/seo/site.ts'
import { buildRobots, buildSitemap } from './src/seo/sitemap.ts'

const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL)

/** Preloads the Latin font files (hashed at build time) so the first paint does not wait for CSS. */
function preloadFonts(): Plugin {
  let base = '/'
  return {
    name: 'preload-latin-fonts',
    configResolved: (config) => {
      base = config.base
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        const tags: HtmlTagDescriptor[] = Object.keys(ctx.bundle ?? {})
          .filter((file) =>
            /(archivo|inter|jetbrains-mono)-latin-(wdth|wght)-normal-.*\.woff2$/.test(file),
          )
          .map((file) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'font',
              type: 'font/woff2',
              href: base + file,
              crossorigin: '',
            },
            injectTo: 'head',
          }))
        return tags
      },
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), preloadFonts()],
  ssgOptions: {
    // Prerender dynamic project pages too.
    includedRoutes: (paths) => [
      ...paths.filter((path) => !path.includes(':') && !path.includes('*')),
      ...projects.map((project) => `/proyectos/${project.slug}`),
      // Static hosts serve 404.html for unknown URLs.
      '/404',
    ],
    onFinished() {
      mkdirSync('dist', { recursive: true })
      const paths = ['/', '/archivo', ...projects.map((project) => `/proyectos/${project.slug}`)]
      writeFileSync(
        'dist/sitemap.xml',
        buildSitemap(siteUrl, paths, new Date().toISOString().slice(0, 10)),
      )
      writeFileSync('dist/robots.txt', buildRobots(siteUrl))
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
