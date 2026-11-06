import { reactive } from 'vue'

const state = reactive({ open: false })
let trigger: HTMLElement | null = null

export function useMenu() {
  return {
    state,
    open: () => (state.open = true),
    close: () => (state.open = false),
    toggle: () => (state.open = !state.open),
    /** The button that opens the menu; it takes focus back when the menu closes. */
    registerTrigger: (el: HTMLElement | null) => (trigger = el),
    getTrigger: () => trigger,
  }
}
