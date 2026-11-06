import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
})

const curtainVisibility = (page: import('@playwright/test').Page) =>
  page.evaluate(() => getComputedStyle(document.querySelector('.curtain')!).visibility)

test('the archive lists every project and filters by category', async ({ page }) => {
  await page.goto('/archivo')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Archivo')
  await expect(page.locator('.row')).toHaveCount(8)
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'graphite')

  await page.getByRole('button', { name: /^Laboratorio/ }).click()
  await expect(page.locator('.row')).toHaveCount(2)
})

test('the home projects link opens the archive through the transition', async ({ page }) => {
  await page.goto('/proyectos')
  const link = page.getByRole('link', { name: /Ver archivo completo/ })
  await link.scrollIntoViewIfNeeded()
  await link.click()

  // The curtain shows while the view is swapped...
  await expect.poll(() => curtainVisibility(page), { timeout: 3_000 }).toBe('visible')
  await expect(page).toHaveURL(/\/archivo$/)
  // ...and is gone, with the new page in place, once it finishes.
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Archivo', { timeout: 5_000 })
  await expect.poll(() => curtainVisibility(page), { timeout: 5_000 }).toBe('hidden')
})

test('a project page shows its case study', async ({ page }) => {
  await page.goto('/proyectos/tienda-headless')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tienda headless')
  await expect(page.locator('h2', { hasText: 'El reto' })).toBeAttached()
  await expect(page.locator('h2', { hasText: 'Resultados' })).toBeAttached()
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'bone')
})

test('the next project link moves to the following project', async ({ page }) => {
  await page.goto('/proyectos/panel-de-reservas')
  const next = page.locator('.project__next')
  await next.scrollIntoViewIfNeeded()
  await next.click()
  await expect(page).toHaveURL(/\/proyectos\/tienda-headless$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Tienda headless', {
    timeout: 5_000,
  })
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 3_000 }).toBeLessThan(50)
})

test('with reduced motion pages swap quickly without the curtain', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/archivo')
  const started = Date.now()
  await page.getByRole('link', { name: /Panel de reservas/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Panel de reservas')
  expect(Date.now() - started).toBeLessThan(1_500)
  expect(await curtainVisibility(page)).toBe('hidden')
})

test('the browser back button returns to the previous page', async ({ page }) => {
  await page.goto('/archivo')
  await page.getByRole('link', { name: /Panel de reservas/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Panel de reservas', {
    timeout: 5_000,
  })
  await page.goBack()
  await expect(page).toHaveURL(/\/archivo$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Archivo', { timeout: 5_000 })
})
