/// <reference types="vite-ssg" />
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { projects } from './src/content/projects'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  ssgOptions: {
    // Prerender dynamic project pages too.
    includedRoutes: (paths) => [
      ...paths.filter((path) => !path.includes(':') && !path.includes('*')),
      ...projects.map((project) => `/proyectos/${project.slug}`),
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
