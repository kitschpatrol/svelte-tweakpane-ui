import { expect, test } from '@playwright/test'

test.describe('Point component', () => {
	test.describe('basic functionality', () => {
		test('point input renders with label', async ({ page }) => {
			await page.goto('/TestPoint.svelte')

			// Should have labels for point inputs
			await expect(page.getByText('Binding 1').first()).toBeVisible()
		})

		test('point input displays value', async ({ page }) => {
			await page.goto('/TestPoint.svelte')

			// Should show the value display
			await expect(page.getByText('Value:').first()).toBeVisible()
		})
	})
})
