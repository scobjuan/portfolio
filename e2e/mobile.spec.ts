import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } })

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
})

const overflow = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

test('projects become cards with a thumbnail on small screens', async ({ page }) => {
  await page.goto('/proyectos')
  const thumb = page.locator('.row__thumb').first()
  await thumb.scrollIntoViewIfNeeded()
  await expect(thumb).toBeVisible()
  expect((await thumb.boundingBox())?.height).toBeGreaterThan(150)
})

test('the archive and a project page do not overflow horizontally', async ({ page }) => {
  await page.goto('/archivo')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Archivo')
  expect(await overflow(page)).toBeLessThanOrEqual(0)

  await page.goto('/proyectos/laboratorio-tipografia-viva')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(await overflow(page)).toBeLessThanOrEqual(0)
})

test('the menu shows the real email and fits the screen', async ({ page }) => {
  await page.goto('/')
  await page.locator('.header__toggle').click()
  const mail = page.locator('.menu__mail')
  await expect(mail).toHaveText('hola@juanescobar.example.com')
  const longest = page.locator('.menu__label', { hasText: 'Experiencia' })
  const box = await longest.boundingBox()
  expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(390 - 16)
})
