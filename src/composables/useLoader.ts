import { reactive } from 'vue'

/** Becomes `done` when the intro loader has finished (or was skipped). */
const state = reactive({ done: false })

export function useLoader() {
  return state
}

export const LOADER_SEEN_KEY = 'portfolio:loader-seen'
