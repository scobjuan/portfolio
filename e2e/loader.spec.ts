import { test, expect } from '@playwright/test'

test('the intro loader shows on the first visit and not afterwards', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('status', { name: 'Cargando' })).toBeVisible()
  await expect(page.getByRole('status', { name: 'Cargando' })).toBeHidden({ timeout: 8_000 })

  await page.reload()
  await expect(page.getByRole('status', { name: 'Cargando' })).toHaveCount(0)
})
