import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
})

test('the hero title is split into letters and becomes visible', async ({ page }) => {
  await page.goto('/')
  const title = page.locator('.hero__title')
  await expect(title).toBeVisible()
  await expect(title.locator('.hero__char').first()).toBeAttached()
  await expect(title).toContainText('Juan')
})

test('with reduced motion the hero stays static and readable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.hero__title')).toBeVisible()
  await expect(page.locator('.hero__role')).toBeVisible()
  await expect(page.locator('html')).not.toHaveClass(/lenis/)
})

test('projects can be filtered and open their page', async ({ page }) => {
  await page.goto('/proyectos')
  await expect(page.locator('.row')).toHaveCount(4)

  await page.getByRole('button', { name: /^Vue \(/ }).click()
  await expect(page.locator('.row')).toHaveCount(2)
  await page.getByRole('button', { name: /^Todos/ }).click()
  await expect(page.locator('.row')).toHaveCount(4)

  await page.getByRole('link', { name: /Panel de reservas/ }).click()
  await expect(page).toHaveURL(/\/proyectos\/panel-de-reservas$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Panel de reservas')
})

test('an unknown project slug says so instead of crashing', async ({ page }) => {
  await page.goto('/proyectos/no-existe')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Proyecto no encontrado')
})

test('the skills category highlights its pills', async ({ page }) => {
  await page.goto('/habilidades')
  const solid = page.locator('.pill.is-solid')
  await expect(solid).toHaveCount(6)
  await page.getByRole('button', { name: /Animación/ }).click()
  await expect(solid).toHaveCount(3)
})

test('experience items expand and collapse', async ({ page }) => {
  await page.goto('/experiencia')
  const second = page.getByRole('button', { name: /Agencia Vértice/ })
  await second.scrollIntoViewIfNeeded()
  await expect(second).toHaveAttribute('aria-expanded', 'false')
  await second.click()
  await expect(second).toHaveAttribute('aria-expanded', 'true')
  await second.click()
  await expect(second).toHaveAttribute('aria-expanded', 'false')
})

test('clicking the email copies it and confirms', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/contacto')
  const copy = page.locator('.contact__copy')
  await copy.scrollIntoViewIfNeeded()
  await copy.click()
  await expect(copy).toContainText('¡Copiado!')
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'hola@juanescobar.example.com',
  )
})

test('no section causes horizontal overflow', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'ink')
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
})
