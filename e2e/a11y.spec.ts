import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

const PAGES = ['/', '/archivo', '/proyectos/panel-de-reservas']

for (const path of PAGES) {
  test(`${path} has no serious accessibility violations`, async ({ page }) => {
    // Audit the final, fully revealed state: the scroll-linked fade of the About text
    // is intentionally low contrast until it is read, so motion is turned off here.
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
    await page.goto(path)
    // Freeze CSS transitions so the audit never samples a colour mid-fade.
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' })
    const results = await new AxeBuilder({ page })
      // Vue DevTools overlay only exists in the dev server.
      .exclude('[class*="vue-devtools"]')
      .analyze()
    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    )
    expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([])
  })
}
