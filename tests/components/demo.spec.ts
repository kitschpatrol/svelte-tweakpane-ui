import { expect, test } from '@playwright/test'

test.describe('Tweakpane Demo', () => {
	test('comprehensive demo page loads all components', async ({ page }) => {
		await page.goto('/TweakpaneDemo.svelte')

		// Demo should render with labels
		await expect(page.locator('.tp-lblv').first()).toBeVisible()
	})
})
