import type { Project, ProjectCategory } from './types'

export const projectCategories: Array<{ id: ProjectCategory | 'all'; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'vue', label: 'Vue' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'lab', label: 'Laboratorio' },
]

export const projects: Project[] = [
  {
    slug: 'panel-de-reservas',
    title: 'Panel de reservas',
    category: 'vue',
    year: 2026,
    stack: ['Vue 3', 'Pinia', 'Vite'],
    summary: 'Panel interno para gestionar reservas, calendarios y disponibilidad en tiempo real.',
    hue: 72,
  },
  {
    slug: 'tienda-headless',
    title: 'Tienda headless',
    category: 'vue',
    year: 2025,
    stack: ['Nuxt', 'TypeScript', 'Stripe'],
    summary: 'Tienda en línea con catálogo desacoplado, carrito persistente y pagos.',
    hue: 232,
  },
  {
    slug: 'dashboard-de-datos',
    title: 'Dashboard de datos',
    category: 'javascript',
    year: 2025,
    stack: ['Vue 3', 'D3', 'REST'],
    summary: 'Visualizaciones interactivas para explorar indicadores de negocio.',
    hue: 160,
  },
  {
    slug: 'laboratorio-tipografia-viva',
    title: 'Lab: tipografía viva',
    category: 'lab',
    year: 2024,
    stack: ['JavaScript', 'WebGL'],
    summary: 'Experimentos con tipografía variable que reacciona al cursor y al scroll.',
    hue: 18,
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
