import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => sessionStorage.setItem('portfolio:loader-seen', '1'))
})

test.describe('desktop effects', () => {
  test.skip(({ isMobile }) => isMobile, 'physics and WebGL are disabled on touch devices')

  test('skills pills fall into a physics pile that stays inside the container', async ({
    page,
  }) => {
    await page.goto('/habilidades')
    const pile = page.locator('.skills__pile')
    await expect(pile).toHaveClass(/is-physics/)
    await page.waitForTimeout(3000)

    const box = await pile.boundingBox()
    expect(box).not.toBeNull()
    // Centers, not bounding boxes: a tilted pill leaning on a wall has a larger box than its shape.
    const centers = await page.locator('.pill').evaluateAll((nodes) =>
      nodes.map((node) => {
        const rect = node.getBoundingClientRect()
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      }),
    )
    expect(centers).toHaveLength(16)
    for (const center of centers) {
      expect(center.x).toBeGreaterThan(box!.x)
      expect(center.x).toBeLessThan(box!.x + box!.width)
      expect(center.y).toBeGreaterThan(box!.y)
      expect(center.y).toBeLessThan(box!.y + box!.height)
    }
  })

  test('a pill can be dragged', async ({ page }) => {
    await page.goto('/habilidades')
    await expect(page.locator('.skills__pile')).toHaveClass(/is-physics/)
    await page.waitForTimeout(3000)

    const positions = () =>
      page.locator('.pill').evaluateAll((nodes) =>
        nodes.map((node) => {
          const rect = node.getBoundingClientRect()
          return { x: rect.left, y: rect.top }
        }),
      )
    const before = await positions()

    // Grab the pill under the pointer (whichever is on top) and pull it upwards.
    const box = (await page.locator('.skills__pile').boundingBox())!
    const x = box.x + box.width / 2
    const y = box.y + box.height - 50
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x, y - 250, { steps: 12 })
    await page.mouse.up()

    const after = await positions()
    const moved = after.filter(
      (pos, i) => Math.hypot(pos.x - before[i]!.x, pos.y - before[i]!.y) > 30,
    )
    expect(moved.length).toBeGreaterThan(0)
  })

  test('the project preview mounts a WebGL canvas', async ({ page }) => {
    await page.goto('/proyectos')
    await expect(page.locator('.preview.has-webgl')).toBeAttached()
    await expect(page.locator('.preview canvas')).toBeAttached()
  })
})

test('with reduced motion neither effect is loaded', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/habilidades')
  await expect(page.locator('.pill').first()).toBeVisible()
  await expect(page.locator('.skills__pile')).not.toHaveClass(/is-physics/)
  await page.goto('/proyectos')
  await expect(page.locator('.preview canvas')).toHaveCount(0)
})

test('on touch devices the pile keeps the plain layout', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile project only')
  await page.goto('/habilidades')
  await expect(page.locator('.pill').first()).toBeVisible()
  await expect(page.locator('.skills__pile')).not.toHaveClass(/is-physics/)
})
