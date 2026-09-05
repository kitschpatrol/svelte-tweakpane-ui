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

	test('shows on label hover and remains open while hovered', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('.tp-lblv_l').hover()
		await expect(tooltip).toBeVisible()
		await tooltip.hover()
		await page.waitForTimeout(150)
		await expect(tooltip).toBeVisible()
	})

	test('dismisses when the control is pressed', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.hover()
		await expect(tooltip).toBeVisible()
		await tooltip.dispatchEvent('mousedown')
		await expect(tooltip).toBeVisible()
		await row.locator('[aria-describedby]').first().dispatchEvent('mousedown')
		await expect(tooltip).toBeHidden()
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
		const row = action.locator('xpath=ancestor::div[contains(@class, "tp-lblv")]')
		const tooltip = row.locator('[role="tooltip"]')

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
