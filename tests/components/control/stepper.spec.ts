import { expect, test } from '@playwright/test'

test.describe('Stepper component', () => {
	test.describe('value binding', () => {
		test('stepper value updates on interaction', async ({ page }) => {
			await page.goto('/TestStepper.svelte')

			// Get initial value
			const initialValue = await page
				.locator('pre')
				.filter({ hasText: 'Value:' })
				.locator('span')
				.innerHTML()

			expect(initialValue).toBe('0')

			// Click up arrow on stepper
			await page.getByRole('textbox').first().press('ArrowUp')

			// Value should have increased
			const newValue = await page
				.locator('pre')
				.filter({ hasText: 'Value:' })
				.locator('span')
				.innerHTML()

			expect(Number(newValue)).toBeGreaterThan(Number(initialValue))
		})
	})

	test.describe('change events', () => {
		test('internal event fires when stepper is directly changed', async ({ page }) => {
			await page.goto('/TestStepper.svelte')

			// Interact with first stepper
			await page.getByRole('textbox').first().press('ArrowUp')

			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 1 Internal:' })
					.locator('span')
					.innerHTML(),
			).toBe('1')
		})

		test('external event fires when value changes from another source', async ({ page }) => {
			await page.goto('/TestStepper.svelte')

			// Interact with first stepper
			await page.getByRole('textbox').first().press('ArrowUp')

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

	test.describe('stepper value display', () => {
		test('stepper displays current value', async ({ page }) => {
			await page.goto('/TestStepperValue.svelte')

			// Stepper should have text input
			await expect(page.locator('.tp-txtv_i').first()).toBeVisible()
		})
	})
})
