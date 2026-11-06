import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } })

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
  await page.goto('/')
})

test('the mobile menu opens, traps focus and closes with Escape', async ({ page }) => {
  const toggle = page.locator('.header__toggle')
  await toggle.click()

  const menu = page.getByRole('dialog', { name: 'Menú de navegación' })
  await expect(menu).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')

  // Focus never leaves the menu or its toggle button.
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab')
    const inside = await page.evaluate(
      () => !!document.activeElement?.closest('#mobile-menu, .header__toggle'),
    )
    expect(inside).toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(menu).toBeHidden()
  await expect(toggle).toBeFocused()
})

test('choosing a link in the menu navigates and closes it', async ({ page }) => {
  await page.locator('.header__toggle').click()
  await page.getByRole('link', { name: /Sobre mí/ }).click()
  await expect(page).toHaveURL(/\/sobre-mi$/)
  await expect(page.getByRole('dialog', { name: 'Menú de navegación' })).toBeHidden()
})
