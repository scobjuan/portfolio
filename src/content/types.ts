export type ProjectCategory = 'vue' | 'javascript' | 'lab'

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  year: number
  /** Featured projects appear on the home page; all of them appear in the archive. */
  featured: boolean
  stack: string[]
  summary: string
  /** Case study copy. */
  role: string
  challenge: string
  solution: string
  results: string[]
  links: { live?: string; repo?: string }
  /** Hue (0-360) used to tint the placeholder preview until real images exist. */
  hue: number
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  location: string
  startYear: number
  /** `null` means the position is current. */
  endYear: number | null
  summary: string
  stack: string[]
}

export type SkillCategoryId = 'frontend' | 'animation' | 'tooling' | 'practices'

export interface Skill {
  name: string
  category: SkillCategoryId
  /** Primary skills are drawn larger and solid. */
  primary?: boolean
}

export interface SkillCategory {
  id: SkillCategoryId
  label: string
}

export interface Stat {
  value: number
  suffix: string
  label: string
}

export interface SocialLink {
  label: string
  href: string
}

export interface Profile {
  name: string
  firstName: string
  lastName: string
  role: string
  tagline: string
  location: string
  /** IANA time zone used for the live local-time label. */
  timeZone: string
  email: string
  availability: string
  about: string
  stats: Stat[]
  social: SocialLink[]
  marquee: string[]
}
