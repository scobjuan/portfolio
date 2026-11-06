import type { RouteRecordRaw } from 'vue-router'

/**
 * Home page sections. Ids are English (used in code and as DOM ids);
 * paths and labels are what the visitor sees, in Spanish.
 * `theme` selects the page atmosphere (see `base.css`).
 */
export const SECTIONS = [
  { id: 'home', path: '/', label: 'Inicio', theme: 'ink' },
  { id: 'projects', path: '/proyectos', label: 'Proyectos', theme: 'graphite' },
  { id: 'about', path: '/sobre-mi', label: 'Sobre mí', theme: 'bone' },
  { id: 'skills', path: '/habilidades', label: 'Habilidades', theme: 'cobalt' },
  { id: 'experience', path: '/experiencia', label: 'Experiencia', theme: 'ink' },
  { id: 'contact', path: '/contacto', label: 'Contacto', theme: 'lime' },
] as const

export type Section = (typeof SECTIONS)[number]
export type SectionId = Section['id']
export type ThemeId = Section['theme']

declare module 'vue-router' {
  interface RouteMeta {
    /** Home page section this route scrolls to. */
    section?: SectionId
    /** Page atmosphere for routes that are not home sections. */
    theme?: ThemeId
    /** Section highlighted in the header while this route is open. */
    parentSection?: SectionId
  }
}

export function getSection(id: string): Section | undefined {
  return SECTIONS.find((section) => section.id === id)
}

export function getSectionByPath(path: string): Section | undefined {
  return SECTIONS.find((section) => section.path === path)
}

const sectionRoutes: RouteRecordRaw[] = SECTIONS.map(({ id, path }) => ({
  path,
  name: id,
  component: () => import('@/views/HomeView.vue'),
  meta: { section: id },
}))

export const routes: RouteRecordRaw[] = [
  ...sectionRoutes,
  {
    path: '/archivo',
    name: 'archive',
    component: () => import('@/views/ArchiveView.vue'),
    meta: { theme: 'graphite', parentSection: 'projects' },
  },
  {
    path: '/proyectos/:slug',
    name: 'project',
    component: () => import('@/views/ProjectView.vue'),
    meta: { theme: 'bone', parentSection: 'projects' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]
