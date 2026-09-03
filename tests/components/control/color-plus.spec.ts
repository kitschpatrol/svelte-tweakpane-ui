import { expect, test } from '@playwright/test'

test.describe('ColorPlus component', () => {
	test('color pickers render with swatches and inline pickers', async ({ page }) => {
		await page.goto('/TestColorPlus.svelte')

		await expect(page.locator('.tp-colswv')).toHaveCount(3)
		await expect(page.locator('.tp-colpv')).toHaveCount(3)
	})

	test('option props reach the plugin without warnings', async ({ page }) => {
		// SvelteKit dev mode emits unrelated unknown-prop warnings, so only
		// collect the plugin's own console output
		const consoleMessages: string[] = []
		page.on('console', (message) => {
			if (
				(message.type() === 'warning' || message.type() === 'error') &&
				message.text().includes('ColorPlus')
			) {
				consoleMessages.push(message.text())
			}
		})

		await page.goto('/TestColorPlus.svelte')
		await expect(page.locator('.tp-colpv').nth(2)).toBeVisible()

		// Default bindings show text fields, the textFields={false} binding hides them
		await expect(page.locator('.tp-colpv').nth(0).locator('.tp-coltxtv')).toHaveCount(1)
		await expect(page.locator('.tp-colpv').nth(2).locator('.tp-coltxtv')).toHaveCount(0)

		// Invalid or unparsed params would warn via the plugin's console output
		expect(consoleMessages).toEqual([])
	})

	test('alpha slider renders for colors with alpha', async ({ page }) => {
		await page.goto('/TestColorPlus.svelte')

		// Bound value is oklch with alpha, so each picker gets an alpha palette
		await expect(page.locator('.tp-colpv').nth(0).locator('.tp-aplv')).toHaveCount(1)
	})
})
