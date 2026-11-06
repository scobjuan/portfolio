import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import { routes } from './router/routes'
import './assets/styles/index.css'

export const createApp = ViteSSG(App, {
  routes,
  base: import.meta.env.BASE_URL,
  // Section changes on the home page handle their own scrolling.
  scrollBehavior: (to) => (to.meta.section ? false : { top: 0 }),
})
