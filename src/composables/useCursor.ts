import { reactive } from 'vue'

export type CursorVariant = 'default' | 'link' | 'project' | 'text' | 'hidden'

/** Shared cursor state. Mark elements with `data-cursor="project"` and `data-cursor-label="Ver caso"`. */
const state = reactive<{ variant: CursorVariant; label: string; pressed: boolean }>({
  variant: 'default',
  label: '',
  pressed: false,
})

export function useCursor() {
  return state
}

const LINK_SELECTOR = 'a[href], button, summary, [role="button"]'
const TEXT_SELECTOR = 'input, textarea, [contenteditable="true"]'

/** Resolves which cursor variant an element under the pointer asks for. */
export function resolveCursor(target: EventTarget | null): {
  variant: CursorVariant
  label: string
} {
  if (!(target instanceof Element)) return { variant: 'default', label: '' }

  const custom = target.closest<HTMLElement>('[data-cursor]')
  if (custom) {
    return {
      variant: custom.dataset.cursor as CursorVariant,
      label: custom.dataset.cursorLabel ?? '',
    }
  }
  if (target.closest(TEXT_SELECTOR)) return { variant: 'text', label: '' }
  if (target.closest(LINK_SELECTOR)) return { variant: 'link', label: '' }
  return { variant: 'default', label: '' }
}
