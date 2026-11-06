import type { Skill, SkillCategory } from './types'

export const skillCategories: SkillCategory[] = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'animation', label: 'Animación' },
  { id: 'tooling', label: 'Herramientas' },
  { id: 'practices', label: 'Prácticas' },
]

export const skills: Skill[] = [
  { name: 'Vue 3', category: 'frontend', primary: true },
  { name: 'JavaScript', category: 'frontend', primary: true },
  { name: 'TypeScript', category: 'frontend', primary: true },
  { name: 'HTML', category: 'frontend' },
  { name: 'CSS', category: 'frontend' },
  { name: 'Pinia', category: 'frontend' },
  { name: 'GSAP', category: 'animation', primary: true },
  { name: 'Three.js', category: 'animation' },
  { name: 'Lottie', category: 'animation' },
  { name: 'Vite', category: 'tooling', primary: true },
  { name: 'Git', category: 'tooling' },
  { name: 'Figma', category: 'tooling' },
  { name: 'Vitest', category: 'tooling' },
  { name: 'Accesibilidad', category: 'practices', primary: true },
  { name: 'Rendimiento', category: 'practices' },
  { name: 'Pruebas E2E', category: 'practices' },
]
