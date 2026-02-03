import { expect, test } from '@playwright/test'

test.describe('Cls component', () => {
	test.describe('basic functionality', () => {
		test('cls utility works for styling', async ({ page }) => {
			await page.goto('/TestCls.svelte')

			// Component should render with labels
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})
})
