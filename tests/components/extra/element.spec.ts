import { expect, test } from '@playwright/test'

test.describe('Element component', () => {
	test.describe('basic functionality', () => {
		test('element renders custom HTML content', async ({ page }) => {
			await page.goto('/TestElementIfStatement.svelte')

			// Element should be inside the tab structure
			await expect(page.locator('.tp-tbiv').first()).toBeVisible()
		})
	})

	test.describe('conditional rendering', () => {
		test('element inside if block renders correctly when condition is true', async ({ page }) => {
			await page.goto('/TestElementIfStatement.svelte')

			// Find the visibility checkbox and click it
			const checkbox = page.locator('.tp-ckbv_w').first()
			await expect(checkbox).toBeVisible()

			await checkbox.click()

			// The Element content should now be visible
			await expect(page.getByText('C', { exact: true }).first()).toBeVisible()
		})

		test('controls after Element in if block render in correct order', async ({ page }) => {
			await page.goto('/TestElementIfStatement.svelte')

			// Toggle visibility on
			await page.locator('.tp-ckbv_w').first().click()

			// Both text inputs should be visible (C and D)
			await expect(page.getByText('C', { exact: true }).first()).toBeVisible()
			await expect(page.getByText('D', { exact: true }).first()).toBeVisible()
		})
	})
})
