import type { RouteLocationNormalizedLoaded } from 'vue-router'
import { getProject } from '@/content/projects'
import { getSection, type ThemeId } from './routes'

type RouteLike = Pick<RouteLocationNormalizedLoaded, 'meta' | 'params' | 'path'>

/** Atmosphere of the page a route shows. */
export function getRouteTheme(route: RouteLike): ThemeId {
  if (route.meta.theme) return route.meta.theme
  return getSection(route.meta.section ?? 'home')?.theme ?? 'ink'
}

/** Name shown on the page transition curtain. */
export function getRouteLabel(route: RouteLike): string {
  if (route.meta.section) return getSection(route.meta.section)?.label ?? ''
  if (route.path === '/archivo') return 'Archivo'
  return getProject(String(route.params.slug ?? ''))?.title ?? ''
}

/**
 * Identity of the rendered view. Home sections share one key so moving between
 * them scrolls instead of triggering the page transition.
 */
export function getViewKey(route: RouteLike): string {
  return route.meta.section ? 'home' : route.path
}
