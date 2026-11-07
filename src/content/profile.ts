import type { Profile } from './types'

/**
 * PLACEHOLDER DATA: every value in `src/content/` is fictional test data
 * (example.com addresses, made-up companies) to be replaced with real content.
 * Keys are English; values are the Spanish copy the visitor reads.
 */
export const profile: Profile = {
  name: 'Juan Escobar',
  firstName: 'Juan',
  lastName: 'Escobar',
  role: 'Desarrollador web',
  tagline: 'Construyo interfaces vivas con JavaScript y Vue 3.',
  taglineHighlights: ['JavaScript', 'Vue 3'],
  location: 'Medellín, Colombia',
  timeZone: 'America/Bogota',
  email: 'hola@juanescobar.example.com',
  availability: 'Disponible para proyectos',
  about:
    'Construyo interfaces que se sienten vivas: rápidas, accesibles y con detalle en cada transición. Me apasiona el punto donde el código se vuelve movimiento y el movimiento se vuelve experiencia.',
  stats: [
    { value: 5, suffix: '+', label: 'Años construyendo web' },
    { value: 24, suffix: '', label: 'Proyectos publicados' },
  ],
  social: [
    { label: 'GitHub', href: 'https://github.com/example' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/example' },
    { label: 'Correo', href: 'mailto:hola@juanescobar.example.com' },
  ],
  marquee: [
    'Vue 3',
    'Composition API',
    'JavaScript',
    'Vite',
    'Pinia',
    'GSAP',
    'Interfaces que reaccionan',
  ],
}
