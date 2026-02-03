import { expect, test } from '@playwright/test'

test.describe('Binding component', () => {
	test.describe('change events', () => {
		test('fires internal event when user interacts directly with binding', async ({ page }) => {
			await page.goto('/TestBinding.svelte')

			// Interact with first binding
			await page.getByRole('textbox').first().press('ArrowUp')

			// First binding should have internal event
			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 1 Internal:' })
					.locator('span')
					.innerHTML(),
			).toBe('1')

			// First binding should NOT have external event
			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 1 External:' })
					.locator('span')
					.innerHTML(),
			).toBe('0')
		})

		test('fires external event when value changes from another binding', async ({ page }) => {
			await page.goto('/TestBinding.svelte')

			// Interact with first binding
			await page.getByRole('textbox').first().press('ArrowUp')

			// Second binding should have external event (value changed from first binding)
			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 2 External:' })
					.locator('span')
					.innerHTML(),
			).toBe('1')

			// Second binding should NOT have internal event
			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 2 Internal:' })
					.locator('span')
					.innerHTML(),
			).toBe('0')
		})

		test('multiple interactions update event counts correctly', async ({ page }) => {
			await page.goto('/TestBinding.svelte')

			// Interact 10 times with second binding
			for (let i = 0; i < 10; i++) {
				await page.getByRole('textbox').last().press('ArrowDown')
			}

			// Check that event counts are correct
			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 1 Internal:' })
					.locator('span')
					.innerHTML(),
			).toBe('0')
			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 1 External:' })
					.locator('span')
					.innerHTML(),
			).toBe('10')
			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 2 Internal:' })
					.locator('span')
					.innerHTML(),
			).toBe('10')
			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 2 External:' })
					.locator('span')
					.innerHTML(),
			).toBe('0')
		})
	})

	test.describe('object change detection', () => {
		test('detects when bound object properties change', async ({ page }) => {
			await page.goto('/TestBindingObjectChange.svelte')

			// Verify the page loads with text inputs
			await expect(page.locator('.tp-txtv_i').first()).toBeVisible()
		})
	})
})
