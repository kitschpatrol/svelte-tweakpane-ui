import { expect, test } from '@playwright/test'

test.describe('Monitor components', () => {
	test.describe('FpsGraph', () => {
		test('fps graph renders', async ({ page }) => {
			await page.goto('/TestFpsEvent.svelte')

			// FPS graph should render with label
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})
})
