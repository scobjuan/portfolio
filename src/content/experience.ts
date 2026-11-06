import type { ExperienceItem } from './types'

export const experience: ExperienceItem[] = [
  {
    id: 'frontend-estudio-norte',
    role: 'Desarrollador Frontend',
    company: 'Estudio Norte',
    location: 'Remoto',
    startYear: 2024,
    endYear: null,
    summary:
      'Lidero la capa de interfaz de productos web en Vue 3: sistema de diseño, rendimiento y animación.',
    stack: ['Vue 3', 'Pinia', 'Vitest'],
  },
  {
    id: 'web-agencia-vertice',
    role: 'Desarrollador web',
    company: 'Agencia Vértice',
    location: 'Medellín',
    startYear: 2022,
    endYear: 2024,
    summary:
      'Sitios y aplicaciones para clientes de retail y servicios, de la maqueta a producción.',
    stack: ['JavaScript', 'Vue', 'Sass'],
  },
  {
    id: 'freelance',
    role: 'Freelance',
    company: 'Sitios y landing pages',
    location: 'Remoto',
    startYear: 2021,
    endYear: 2022,
    summary: 'Landing pages y sitios corporativos para pequeños negocios.',
    stack: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 'formacion',
    role: 'Formación',
    company: 'Programa de desarrollo web',
    location: 'Medellín',
    startYear: 2020,
    endYear: 2021,
    summary: 'Fundamentos de programación, JavaScript moderno y primeros proyectos con Vue.',
    stack: ['JavaScript', 'Git'],
  },
]
