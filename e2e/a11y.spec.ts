import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test'

test('the home page has no serious accessibility violations', async ({ page }) => {
  // Audit the final, fully revealed state: the scroll-linked fade of the About text
  // is intentionally low contrast until it is read, so motion is turned off here.
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
  await page.goto('/')
  const results = await new AxeBuilder({ page })
    // Vue DevTools overlay only exists in the dev server.
    .exclude('[class*="vue-devtools"]')
    .analyze()
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  )
  expect(serious.map((v) => `${v.id}: ${v.help}`)).toEqual([])
})
