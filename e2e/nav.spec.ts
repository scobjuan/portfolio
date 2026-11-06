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

test('the header keeps Proyectos active on a project page', async ({ page }) => {
  await page.goto('/proyectos/tienda-headless')
  await expect(page.locator('.header__link[aria-current="true"]')).toHaveText(/Proyectos/)
})

test('leaving a project for a home section lands on that section', async ({ page }) => {
  await page.goto('/proyectos/panel-de-reservas')
  await page
    .getByRole('link', { name: /Contacto/ })
    .first()
    .click()
  await expect(page).toHaveURL(/\/contacto$/)
  await expect(page.locator('.contact__title')).toBeInViewport({ timeout: 6_000 })
})
