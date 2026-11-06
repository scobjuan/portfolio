import { test, expect } from '@playwright/test'

// Returning visitors skip the intro loader; most tests start from that state.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
})

test('the root shows the name', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Juan Escobar')
})

test('an unknown route shows the 404 page', async ({ page }) => {
  await page.goto('/no-existe')
  await expect(page.locator('h1')).toHaveText('404')
})

test('opening a section URL scrolls to that section', async ({ page }) => {
  await page.goto('/contacto')
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000)
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'lime')
})

test('scrolling to another section updates the URL', async ({ page }) => {
  await page.goto('/')
  // The home view is lazy loaded; wait until it is mounted and tracking sections.
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'ink')
  await page.evaluate(() => document.getElementById('skills')?.scrollIntoView())
  await expect(page).toHaveURL(/\/habilidades$/)
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'cobalt')
})
