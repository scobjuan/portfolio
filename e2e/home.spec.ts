import { test, expect } from '@playwright/test'

test('the root shows the name', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Juan Escobar')
})

test('an unknown route shows the 404 page', async ({ page }) => {
  await page.goto('/no-existe')
  await expect(page.locator('h1')).toHaveText('404')
})
