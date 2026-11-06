import { test, expect } from '@playwright/test'

// Desktop navigation only: on mobile the links live in the menu (see menu.spec.ts).
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
})

test('clicking a nav link scrolls to its section and keeps the URL', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Experiencia/ }).click()
  await expect(page).toHaveURL(/\/experiencia$/)
  await expect
    .poll(() =>
      page.evaluate(() => document.getElementById('experience')?.getBoundingClientRect().top),
    )
    .toBeLessThan(40)
})
