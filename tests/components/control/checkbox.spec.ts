import { expect, test } from '@playwright/test'

test.describe('Checkbox component', () => {
	test.describe('basic functionality', () => {
		test('checkbox renders and can be toggled', async ({ page }) => {
			await page.goto('/TestCheckbox.svelte')

			// Find the checkbox wrapper element (actual input is hidden, click on wrapper)
			const checkboxWrapper = page.locator('.tp-ckbv_w').first()
			await expect(checkboxWrapper).toBeVisible()

			// Get initial value
			const initialValue = await page
				.locator('pre')
				.filter({ hasText: 'Value:' })
				.locator('span')
				.innerHTML()

			// Click to toggle using the wrapper
			await checkboxWrapper.click()

			// Value should have changed
			const newValue = await page
				.locator('pre')
				.filter({ hasText: 'Value:' })
				.locator('span')
				.innerHTML()

			expect(newValue).not.toBe(initialValue)
		})
	})

	test.describe('change events', () => {
		test('internal event fires when checkbox is directly changed', async ({ page }) => {
			await page.goto('/TestCheckbox.svelte')

			// Click first checkbox wrapper
			await page.locator('.tp-ckbv_w').first().click()

			// Check internal event count
			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 1 Internal:' })
					.locator('span')
					.innerHTML(),
			).toBe('1')
		})

		test('external event fires when value changes from another checkbox', async ({ page }) => {
			await page.goto('/TestCheckbox.svelte')

			// Click first checkbox wrapper
			await page.locator('.tp-ckbv_w').first().click()

			// Binding 2 should receive external event
			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 2 External:' })
					.locator('span')
					.innerHTML(),
			).toBe('1')
		})
	})
})
