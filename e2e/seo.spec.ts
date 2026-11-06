import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
})

const meta = (page: import('@playwright/test').Page, selector: string) =>
  page.locator(`head ${selector}`).first().getAttribute('content')

test('the archive sets its own title, description and canonical URL', async ({ page }) => {
  await page.goto('/archivo')
  await expect(page).toHaveTitle('Archivo | Juan Escobar')
  expect(await meta(page, 'meta[name="description"]')).toContain('Todos los proyectos')
  expect(await meta(page, 'meta[property="og:title"]')).toBe('Archivo | Juan Escobar')
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute('href', /\/archivo$/)
})

test('a project page uses the project in its title and social preview', async ({ page }) => {
  await page.goto('/proyectos/tienda-headless')
  await expect(page).toHaveTitle('Tienda headless | Juan Escobar')
  expect(await meta(page, 'meta[property="og:description"]')).toContain('catálogo desacoplado')
  expect(await meta(page, 'meta[property="og:image"]')).toMatch(/\/og-image\.png$/)
})

test('home sections share the home canonical URL', async ({ page }) => {
  await page.goto('/sobre-mi')
  await expect(page).toHaveTitle('Juan Escobar | Desarrollador web')
  await expect(page.locator('head link[rel="canonical"]')).toHaveAttribute(
    'href',
    /^https?:\/\/[^/]+\/$/,
  )
})

test('unknown pages are kept out of search results', async ({ page }) => {
  await page.goto('/no-existe')
  expect(await meta(page, 'meta[name="robots"]')).toBe('noindex')
  await expect(page).toHaveTitle('Página no encontrada | Juan Escobar')
})
