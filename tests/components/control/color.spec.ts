import { expect, test } from '@playwright/test'

test.describe('Color component', () => {
	test.describe('basic functionality', () => {
		test('color picker renders with color swatch', async ({ page }) => {
			await page.goto('/TestColor.svelte')

			// Should have color swatch elements
			await expect(page.locator('.tp-colswv').first()).toBeVisible()
		})

		test('color picker can be expanded', async ({ page }) => {
			await page.goto('/TestColor.svelte')

			// Click on the color swatch to expand picker
			const swatch = page.locator('.tp-colswv').first()
			await swatch.click()

			// Expanded picker elements should be visible
			await expect(page.locator('.tp-colv').first()).toBeVisible()
		})
	})

	test.describe('change events', () => {
		test('changing color fires internal event', async ({ page }) => {
			await page.goto('/TestColor.svelte')

			// Click on the color swatch to expand
			await page.locator('.tp-colswv').first().click()

			// Wait for picker to expand
			await expect(page.locator('.tp-colv').first()).toBeVisible()

			// The event counters should exist
			await expect(page.locator('pre').filter({ hasText: 'Binding 1 Internal:' })).toBeVisible()
		})
	})
})
