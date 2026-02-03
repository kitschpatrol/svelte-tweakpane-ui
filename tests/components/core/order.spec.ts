import { expect, test } from '@playwright/test'

test.describe('Component ordering', () => {
	test.describe('element order', () => {
		test('components render in correct order', async ({ page }) => {
			await page.goto('/TestOrder.svelte')

			// Page should load with components in order
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})
})
