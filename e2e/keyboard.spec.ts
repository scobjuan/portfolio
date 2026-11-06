import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
})

test('the first Tab stop is a visible skip link that jumps to the content', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'ink')
  await page.keyboard.press('Tab')

  const skip = page.getByRole('link', { name: 'Saltar al contenido' })
  await expect(skip).toBeFocused()
  const box = await skip.boundingBox()
  expect(box?.y).toBeGreaterThanOrEqual(0)

  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#main$/)
})

test('keyboard focus is visible on interactive elements', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'ink')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  const outline = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement as Element)
    return `${style.outlineStyle} ${style.outlineWidth}`
  })
  expect(outline).toBe('solid 2px')
})
