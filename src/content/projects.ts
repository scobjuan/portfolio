import type { Project, ProjectCategory } from './types'

export const projectCategories: Array<{ id: ProjectCategory | 'all'; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'vue', label: 'Vue' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'lab', label: 'Laboratorio' },
]

/** PLACEHOLDER DATA: fictional projects, see `profile.ts`. */
export const projects: Project[] = [
  {
    slug: 'panel-de-reservas',
    title: 'Panel de reservas',
    category: 'vue',
    year: 2026,
    featured: true,
    stack: ['Vue 3', 'Pinia', 'Vite'],
    summary: 'Panel interno para gestionar reservas, calendarios y disponibilidad en tiempo real.',
    hue: 72,
    role: 'Desarrollo frontend y sistema de diseño',
    challenge:
      'El equipo gestionaba las reservas en hojas de cálculo y perdía tiempo cruzando disponibilidad entre sedes.',
    solution:
      'Un panel en Vue 3 con calendario por recurso, estado global con Pinia y actualizaciones en vivo.',
    results: [
      'Menos tiempo en la gestión diaria',
      'Cero reservas duplicadas',
      'Interfaz usable con teclado',
    ],
    links: { live: 'https://example.com/reservas', repo: 'https://github.com/example/reservas' },
  },
  {
    slug: 'tienda-headless',
    title: 'Tienda headless',
    category: 'vue',
    year: 2025,
    featured: true,
    stack: ['Nuxt', 'TypeScript', 'Stripe'],
    summary: 'Tienda en línea con catálogo desacoplado, carrito persistente y pagos.',
    hue: 232,
    role: 'Arquitectura frontend e integración de pagos',
    challenge:
      'La tienda original era lenta y difícil de mantener, con el catálogo atado al frontend.',
    solution:
      'Frontend en Nuxt consumiendo un catálogo headless, con carrito persistente y pagos con Stripe.',
    results: [
      'Carga inicial más rápida',
      'Catálogo editable sin desplegar',
      'Checkout en un solo paso',
    ],
    links: { live: 'https://example.com/tienda' },
  },
  {
    slug: 'dashboard-de-datos',
    title: 'Dashboard de datos',
    category: 'javascript',
    year: 2025,
    featured: true,
    stack: ['Vue 3', 'D3', 'REST'],
    summary: 'Visualizaciones interactivas para explorar indicadores de negocio.',
    hue: 160,
    role: 'Visualización de datos y frontend',
    challenge:
      'Los indicadores vivían en informes estáticos que nadie podía explorar por su cuenta.',
    solution: 'Gráficos interactivos con D3 sobre una API REST, con filtros compartibles por URL.',
    results: ['Exploración autónoma de datos', 'Filtros compartibles', 'Gráficos accesibles'],
    links: { repo: 'https://github.com/example/dashboard' },
  },
  {
    slug: 'laboratorio-tipografia-viva',
    title: 'Lab: tipografía viva',
    category: 'lab',
    year: 2024,
    featured: true,
    stack: ['JavaScript', 'WebGL'],
    summary: 'Experimentos con tipografía variable que reacciona al cursor y al scroll.',
    hue: 18,
    role: 'Diseño y desarrollo creativo',
    challenge: 'Explorar hasta dónde puede responder una fuente variable a la interacción.',
    solution: 'Una serie de estudios con ejes variables ligados a cursor, scroll y tiempo.',
    results: ['Siete estudios publicados', 'Base para este portafolio'],
    links: { repo: 'https://github.com/example/tipografia-viva' },
  },
  {
    slug: 'portal-de-clientes',
    title: 'Portal de clientes',
    category: 'vue',
    year: 2023,
    featured: false,
    stack: ['Vue 3', 'Vue Router', 'Sass'],
    summary: 'Área privada para que los clientes consulten facturas y soliciten soporte.',
    hue: 290,
    role: 'Desarrollo frontend',
    challenge: 'Los clientes pedían facturas por correo y el soporte se saturaba.',
    solution: 'Un portal con autenticación, histórico de facturas y tickets de soporte.',
    results: ['Menos solicitudes por correo', 'Autoservicio de facturas'],
    links: {},
  },
  {
    slug: 'planificador-de-rutas',
    title: 'Planificador de rutas',
    category: 'javascript',
    year: 2023,
    featured: false,
    stack: ['JavaScript', 'Leaflet', 'REST'],
    summary: 'Mapa interactivo para planificar y comparar rutas de reparto.',
    hue: 120,
    role: 'Desarrollo frontend',
    challenge: 'Planificar rutas manualmente tomaba horas cada mañana.',
    solution: 'Un mapa interactivo que ordena paradas y compara alternativas de recorrido.',
    results: ['Rutas planificadas en minutos'],
    links: { repo: 'https://github.com/example/rutas' },
  },
  {
    slug: 'sitio-de-restaurante',
    title: 'Sitio de restaurante',
    category: 'vue',
    year: 2022,
    featured: false,
    stack: ['Vue 2', 'Sass'],
    summary: 'Sitio con carta digital, reservas y galería para un restaurante local.',
    hue: 36,
    role: 'Desarrollo web',
    challenge: 'El restaurante no tenía presencia web ni forma de recibir reservas.',
    solution: 'Un sitio ligero con carta digital, formulario de reservas y galería.',
    results: ['Reservas en línea', 'Carta siempre actualizada'],
    links: { live: 'https://example.com/restaurante' },
  },
  {
    slug: 'lab-particulas',
    title: 'Lab: partículas',
    category: 'lab',
    year: 2022,
    featured: false,
    stack: ['JavaScript', 'Canvas'],
    summary: 'Sistema de partículas en canvas que responde a la música.',
    hue: 330,
    role: 'Desarrollo creativo',
    challenge: 'Entender el rendimiento de miles de partículas en el navegador.',
    solution: 'Un sistema en canvas con pools de objetos y análisis de audio.',
    results: ['60 fps con miles de partículas'],
    links: { repo: 'https://github.com/example/particulas' },
  },
]

export const featuredProjects = projects.filter((project) => project.featured)

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

/** The project after `slug` in the archive, wrapping around to the first. */
export function getNextProject(slug: string): Project | undefined {
  const index = projects.findIndex((project) => project.slug === slug)
  return index === -1 ? undefined : projects[(index + 1) % projects.length]
}
