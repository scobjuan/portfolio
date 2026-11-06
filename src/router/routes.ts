import type { RouteRecordRaw } from 'vue-router'

/**
 * Home page sections. Ids are English (used in code); paths are the
 * public Spanish URLs the visitor sees.
 */
export const SECTIONS = [
  { id: 'home', path: '/' },
  { id: 'projects', path: '/proyectos' },
  { id: 'about', path: '/sobre-mi' },
  { id: 'skills', path: '/habilidades' },
  { id: 'experience', path: '/experiencia' },
  { id: 'contact', path: '/contacto' },
] as const

export type SectionId = (typeof SECTIONS)[number]['id']

const sectionRoutes: RouteRecordRaw[] = SECTIONS.map(({ id, path }) => ({
  path,
  name: id,
  component: () => import('@/views/HomeView.vue'),
  meta: { section: id },
}))

export const routes: RouteRecordRaw[] = [
  ...sectionRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]
