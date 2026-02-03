import { expect, test } from '@playwright/test'

test.describe('AutoValue component', () => {
	test.describe('basic functionality', () => {
		test('auto-generates appropriate control for value type', async ({ page }) => {
			await page.goto('/TestAutoValue.svelte')

			// AutoValue should render controls (labels)
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})
})
