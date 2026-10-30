import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { demos } from '../src/data/demos'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Frontend Problems.')
})

test('page reflows without overflow and has no runtime errors', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const demo of demos) {
    await page.getByRole('button', { name: new RegExp(demo.shortTitle, 'i') }).click()
    for (const mode of ['Before', 'After']) {
      await page.getByRole('button', { name: mode, exact: true }).click()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
    }
    await page.getByRole('button', { name: 'View code' }).click()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await expect(page.getByRole('code')).not.toBeEmpty()
  }
  expect(errors).toEqual([])
  await page.getByRole('button', { name: 'Responsive layout', exact: false }).click()
  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.screenshot({
    path: `docs/screenshots/${testInfo.project.name}.png`,
    fullPage: true,
    animations: 'disabled',
  })
})

test('all repaired examples pass automated accessibility checks', async ({ page }) => {
  for (const demo of demos) {
    await page.getByRole('button', { name: new RegExp(demo.shortTitle, 'i') }).click()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    const violations = results.violations.map((item) => ({
      id: item.id,
      nodes: item.nodes.map((node) => ({ target: node.target, failure: node.failureSummary })),
    }))
    expect(violations, demo.id).toEqual([])
  }
})

test('broken, code, error, and dialog states pass automated accessibility checks', async ({
  page,
}) => {
  // Legacy mode skips frame injection: the sandboxed fixture allows no scripts, so axe would hang.
  const scan = async (label: string) => {
    const results = await new AxeBuilder({ page })
      .setLegacyMode(true)
      .exclude('iframe.broken-frame')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(
      results.violations.map((item) => ({ id: item.id, nodes: item.nodes.map((n) => n.target) })),
      label,
    ).toEqual([])
  }
  for (const demo of demos) {
    await page.getByRole('button', { name: new RegExp(demo.shortTitle, 'i') }).click()
    await page.getByRole('button', { name: 'Before', exact: true }).click()
    await scan(`${demo.id} before`)
    await page.getByRole('button', { name: 'View code' }).click()
    await scan(`${demo.id} before code`)
    await page.getByRole('button', { name: 'Preview' }).click()
    await page.getByRole('button', { name: 'After', exact: true }).click()
  }
  await page.getByRole('button', { name: 'Form validation', exact: false }).click()
  await page.getByRole('button', { name: 'Validate inquiry' }).click()
  await scan('form errors')
  await page.getByRole('button', { name: 'Interactive components', exact: false }).click()
  await page.getByRole('button', { name: 'View summary' }).click()
  await scan('dialog open')
})

test('before examples are sandboxed and never overflow the host page', async ({ page }) => {
  for (const demo of demos) {
    await page.getByRole('button', { name: new RegExp(demo.shortTitle, 'i') }).click()
    await page.getByRole('button', { name: 'Before', exact: true }).click()
    const frame = page.locator('iframe')
    await expect(frame).toHaveAttribute('sandbox', '')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

test('mobile header navigation supports keyboard and anchors', async ({ page }) => {
  const menu = page.getByRole('button', { name: 'Open navigation', exact: true })
  if (await menu.isVisible()) {
    await menu.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu).toBeFocused()
    await menu.click()
  }
  await page
    .getByRole('navigation', { name: 'Main navigation' })
    .getByRole('link', { name: 'The lab', exact: true })
    .click()
  await expect(page).toHaveURL(/#lab$/)
  if (await menu.isVisible()) await expect(menu).toHaveAttribute('aria-expanded', 'false')
})

test('hero comparison supports the keyboard', async ({ page }) => {
  const slider = page.getByRole('slider', { name: 'Before and after comparison' })
  await slider.focus()
  await page.keyboard.press('ArrowRight')
  await expect(slider).toHaveValue('45')
  await page.keyboard.press('Home')
  await expect(slider).toHaveValue('0')
  await page.keyboard.press('End')
  await expect(slider).toHaveValue('100')
})

test('hero comparison can be dragged on the picture itself', async ({ page }) => {
  const slider = page.getByRole('slider', { name: 'Before and after comparison' })
  const picture = page.locator('.hero-comparison')
  await picture.scrollIntoViewIfNeeded()
  const box = (await picture.boundingBox())!
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height / 2, { steps: 4 })
  await page.mouse.up()
  await expect(slider).toHaveValue('80')
})

test('sample navigation opens, selects, and restores focus', async ({ page }) => {
  await page.getByRole('button', { name: 'Mobile navigation', exact: false }).click()
  const menu = page.getByRole('button', { name: 'Sample navigation' })
  await menu.click()
  await page
    .getByRole('navigation', { name: 'Sample pages' })
    .getByRole('button', { name: 'Studio', exact: true })
    .click()
  await expect(page.getByRole('heading', { name: 'Small studio. Big ideas.' })).toBeVisible()
  await expect(menu).toBeFocused()
  await menu.click()
  await page.keyboard.press('Escape')
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
})

test('form errors, focus, success, and retry work', async ({ page }) => {
  await page.getByRole('button', { name: 'Form validation', exact: false }).click()
  await page.getByRole('button', { name: 'Validate inquiry' }).click()
  await expect(page.getByLabel('Name', { exact: true })).toBeFocused()
  await expect(page.getByLabel('Email', { exact: true })).toHaveAttribute('aria-invalid', 'true')
  await page.getByLabel('Name', { exact: true }).fill('Alex Morgan')
  await page.getByLabel('Email', { exact: true }).fill('alex@example.com')
  await page.getByLabel('Project brief').fill('Repair the mobile layout please.')
  await page.getByRole('button', { name: 'Validate inquiry' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'That’s a well-formed inquiry.' })).toBeFocused()
  await page.getByRole('button', { name: 'Try again' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('')
  await expect(page.getByLabel('Name', { exact: true })).toBeFocused()
})

test('modal contains focus, closes with Escape, restores focus, and saves', async ({ page }) => {
  await page.getByRole('button', { name: 'Interactive components', exact: false }).click()
  await page.getByLabel('Repair type').selectOption('Form validation')
  const trigger = page.getByRole('button', { name: 'View summary' })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading')).toHaveText('Form validation')
  for (let index = 0; index < 4; index++) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await trigger.click()
  await dialog.getByRole('button', { name: 'Save this repair' }).click()
  await expect(dialog).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute(
    'aria-disabled',
    'true',
  )
})

test('saving from the page keeps keyboard focus on the save button', async ({ page }) => {
  await page.getByRole('button', { name: 'Interactive components', exact: false }).click()
  await page.getByRole('button', { name: 'Save repair' }).focus()
  await page.keyboard.press('Enter')
  const saved = page.getByRole('button', { name: 'Saved', exact: true })
  await expect(saved).toBeFocused()
  await expect(saved).toHaveAttribute('aria-disabled', 'true')
})

test('responsive image loads locally at its natural aspect ratio', async ({ page }) => {
  await page.getByRole('button', { name: 'Responsive images', exact: false }).click()
  const image = page.getByRole('img', { name: /modern home/ })
  await image.scrollIntoViewIfNeeded()
  await expect
    .poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0))
    .toBe(true)
  expect(
    await image.evaluate(
      (node: HTMLImageElement) => new URL(node.currentSrc).origin === location.origin,
    ),
  ).toBe(true)
  const bounds = await image.boundingBox()
  expect(bounds).not.toBeNull()
  expect(bounds!.width / bounds!.height).toBeCloseTo(1.5, 1)
})

test('reduced motion disables smooth scroll and entrance transforms', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.reload()
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  )
  await expect(page.locator('.hero-copy')).toHaveCSS('transform', 'none')
})
