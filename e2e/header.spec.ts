import { test, expect } from '@playwright/test'

// Wheel scrolling is desktop-only; the mobile project covers the menu in menu.spec.ts.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
})

test('the header hides while scrolling down and returns when scrolling up', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'ink')
  await page.mouse.move(600, 400)

  await page.mouse.wheel(0, 1200)
  await expect(page.locator('.header')).toHaveClass(/is-hidden/)

  // Let the smooth scroll settle, otherwise the page is still travelling downward.
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1100)
  await page.mouse.wheel(0, -300)
  await expect(page.locator('.header')).not.toHaveClass(/is-hidden/)
})
