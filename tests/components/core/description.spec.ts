import { expect, test } from '@playwright/test'

// cspell:words describedby

const WHITESPACE_PATTERN = /\s+/v

test.describe('Control descriptions', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/TestDescription.svelte')
		await expect(page.locator('[role="tooltip"]')).toHaveCount(4)
	})

	test('adds descriptions to bindings, blades, and buttons', async ({ page }) => {
		const describedBlades = page.locator('[data-stui-description]')
		const tooltips = page.locator('[role="tooltip"]')

		await expect(describedBlades).toHaveCount(4)
		await expect(tooltips).toHaveCount(4)
		await expect(tooltips.first()).toHaveText('Adjusts the amount of glow.\nUse sparingly.')
		await expect(tooltips.first()).toHaveAttribute('popover', 'hint')
		await expect(describedBlades.first().locator('.tp-lblv_l')).toHaveAttribute(
			'title',
			'Adjusts the amount of glow.\nUse sparingly.',
		)
		await expect(describedBlades.first()).not.toHaveAttribute('title')
	})

	test('connects interactive controls to their descriptions', async ({ page }) => {
		const glowRow = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const description = glowRow.locator('[role="tooltip"]')
		const descriptionId = await description.getAttribute('id')
		const controls = await glowRow.locator('[aria-describedby]').all()

		expect(descriptionId).not.toBeNull()
		for (const control of controls) {
			const describedBy = await control.getAttribute('aria-describedby')
			expect(describedBy?.split(WHITESPACE_PATTERN)).toContain(descriptionId)
		}
	})

	test('shows beside the pointer after a hover delay and remains open while hovered', async ({
		page,
	}) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const label = row.locator('.tp-lblv_l')
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('[aria-describedby]').first().hover()
		await expect(tooltip).toBeHidden()

		const labelBounds = await label.boundingBox()
		expect(labelBounds).not.toBeNull()
		await label.hover({ position: { x: 12, y: 8 } })
		await page.waitForTimeout(400)
		await expect(tooltip).toBeHidden()
		await expect(tooltip).toBeVisible()

		const tooltipBounds = await tooltip.boundingBox()
		expect(tooltipBounds).not.toBeNull()
		expect(tooltipBounds?.x).toBeCloseTo((labelBounds?.x ?? 0) + 12, 0)
		expect(tooltipBounds?.y).toBeGreaterThan((labelBounds?.y ?? 0) + 8)
		await expect(tooltip).toHaveCSS('overflow', 'visible')
		await expect(tooltip).toHaveCSS('text-align', 'left')

		await tooltip.hover()
		await page.waitForTimeout(150)
		await expect(tooltip).toBeVisible()
	})

	test('dismisses when the control is pressed', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('.tp-lblv_l').hover()
		await expect(tooltip).toBeVisible()
		await tooltip.dispatchEvent('mousedown')
		await expect(tooltip).toBeVisible()
		await expect(tooltip).toHaveCSS('opacity', '1')
		await row.locator('[aria-describedby]').first().dispatchEvent('mousedown')
		await page.waitForTimeout(250)
		const fadingOpacity = Number(
			await tooltip.evaluate((element) => getComputedStyle(element).opacity),
		)
		expect(fadingOpacity).toBeGreaterThan(0)
		expect(fadingOpacity).toBeLessThan(1)
		await expect(tooltip).toBeHidden()
	})

	test('allows the fade-out duration to be configured with CSS', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.evaluate((element) => {
			element.style.setProperty('--stui-description-fade-out-duration', '50ms')
		})
		await row.locator('.tp-lblv_l').hover()
		await expect(tooltip).toBeVisible()
		await expect(tooltip).toHaveCSS('opacity', '1')
		await row.locator('[aria-describedby]').first().dispatchEvent('mousedown')
		await page.waitForTimeout(100)
		expect(await tooltip.isVisible()).toBe(false)
	})

	test('shows on control focus and dismisses with Escape', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({ hasText: 'Quality' })
		const tooltip = row.locator('[role="tooltip"]')

		await row.getByRole('combobox').focus()
		await expect(tooltip).toBeVisible()
		await page.keyboard.press('Escape')
		await expect(tooltip).toBeHidden()
	})

	test('remains available from the label when the control is disabled', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Settings', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('.tp-lblv_l').hover()
		await expect(tooltip).toBeVisible()
		await expect(row.getByRole('button', { name: 'Reset' })).toBeDisabled()
	})

	test('uses the whole blade as the hover target when there is no label', async ({ page }) => {
		const action = page.getByRole('button', { name: 'Action' })
		const row = action.locator(
			'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " tp-lblv ")]',
		)
		const tooltip = row.locator('[role="tooltip"]')

		await expect(row).toHaveAttribute('title', 'Performs an unlabeled action.')
		await action.hover()
		await expect(tooltip).toBeVisible()
	})

	test('follows a reactively updated label', async ({ page }) => {
		await page.getByRole('button', { name: 'Update label' }).click()

		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Bloom', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('.tp-lblv_l').hover()
		await expect(tooltip).toBeVisible()
	})

	test('reactively updates and removes a description', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})

		await page.getByRole('button', { name: 'Update description' }).click()
		await expect(page.getByTestId('description-state')).toHaveText('Updated description')
		await expect(row.locator('[role="tooltip"]')).toHaveText('Updated description')
		await expect(row.locator('.tp-lblv_l')).toHaveAttribute('title', 'Updated description')
		await expect(
			page.locator('.tp-lblv').filter({ hasText: 'Settings' }).locator('[role="tooltip"]'),
		).toHaveText('Updated description')

		const describedControl = row.locator('[aria-describedby]').first()
		await describedControl.evaluate((element) => {
			const ids = element.getAttribute('aria-describedby') ?? ''
			element.setAttribute('aria-describedby', `${ids} external-description`)
		})

		await page.getByRole('button', { name: 'Remove description' }).click()
		await expect(row).not.toHaveAttribute('data-stui-description')
		await expect(row.locator('[role="tooltip"]')).toHaveCount(0)
		await expect(describedControl).toHaveAttribute('aria-describedby', 'external-description')
	})

	test('retains the non-destructive title when the Popover API is unavailable', async ({
		page,
	}) => {
		await page.addInitScript(() => {
			Object.defineProperties(HTMLElement.prototype, {
				hidePopover: {
					configurable: true,
					value: undefined,
				},
				showPopover: {
					configurable: true,
					value: undefined,
				},
			})
		})
		await page.reload()

		const glowRow = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const settingsRow = page.locator('.tp-lblv').filter({
			has: page.getByText('Settings', { exact: true }),
		})

		const glowLabel = glowRow.locator('.tp-lblv_l')
		const settingsLabel = settingsRow.locator('.tp-lblv_l')

		await expect(glowLabel).toHaveAttribute('title', 'Adjusts the amount of glow.\nUse sparingly.')
		await expect(glowRow.locator('[role="tooltip"]')).toBeHidden()
		await expect(glowRow.locator('[role="tooltip"]')).not.toHaveAttribute('popover')

		await page.getByRole('button', { name: 'Update description' }).click()
		await expect(glowLabel).toHaveAttribute('title', 'Updated description')

		await settingsLabel.evaluate((element) => element.setAttribute('title', 'Application title'))
		await page.getByRole('button', { name: 'Remove description' }).click()
		await expect(glowLabel).not.toHaveAttribute('title')
		await expect(settingsLabel).toHaveAttribute('title', 'Application title')
	})

	test('inherits the active Tweakpane theme', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('.tp-lblv_l').hover()
		await expect(tooltip).toBeVisible()

		const colors = await tooltip.evaluate((element) => {
			const pane = element.closest<HTMLElement>('.tp-rotv')
			const probe = document.createElement('div')
			probe.style.backgroundColor = 'var(--in-fg)'
			probe.style.color = 'var(--bs-bg)'
			pane?.append(probe)

			const style = getComputedStyle(element)
			const probeStyle = getComputedStyle(probe)
			const result = {
				background: style.backgroundColor,
				expectedBackground: probeStyle.backgroundColor,
				expectedForeground: probeStyle.color,
				foreground: style.color,
			}
			probe.remove()

			return result
		})

		expect(colors.background).toBe(colors.expectedBackground)
		expect(colors.foreground).toBe(colors.expectedForeground)
	})
})
