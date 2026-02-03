import { expect, test } from '@playwright/test'

test.describe('List component', () => {
	test.describe('basic functionality', () => {
		test('list/select renders', async ({ page }) => {
			await page.goto('/TestList.svelte')

			// Should have a list label
			await expect(page.getByText('Alphanumerics 1').first()).toBeVisible()
		})

		test('list displays initial value', async ({ page }) => {
			await page.goto('/TestList.svelte')

			// Initial value should be displayed
			const initialValue = await page
				.locator('pre')
				.filter({ hasText: 'Value:' })
				.locator('span')
				.innerHTML()

			expect(initialValue).toBe('1')
		})
	})
})
