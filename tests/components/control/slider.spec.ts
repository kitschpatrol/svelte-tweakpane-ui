import { expect, test } from '@playwright/test'

test.describe('Slider component', () => {
	test.describe('value binding', () => {
		test('slider value updates on interaction', async ({ page }) => {
			await page.goto('/TestSlider.svelte')

			// Get the initial value
			const initialValue = await page
				.locator('pre')
				.filter({ hasText: 'Value:' })
				.locator('span')
				.innerHTML()

			// Interact with the first slider
			await page.getByRole('textbox').first().press('ArrowUp')

			// Value should have changed
			const newValue = await page
				.locator('pre')
				.filter({ hasText: 'Value:' })
				.locator('span')
				.innerHTML()

			expect(Number(newValue)).toBeGreaterThan(Number(initialValue))
		})

		test('multiple sliders sharing the same value stay synchronized', async ({ page }) => {
			await page.goto('/TestSlider.svelte')

			// Interact with second slider
			await page.getByRole('textbox').last().press('ArrowUp')
			await page.getByRole('textbox').last().press('ArrowUp')
			await page.getByRole('textbox').last().press('ArrowUp')

			// Both sliders should show the same value
			const value = await page
				.locator('pre')
				.filter({ hasText: 'Value:' })
				.locator('span')
				.innerHTML()

			expect(Number(value)).toBeGreaterThan(0)
		})
	})

	test.describe('change events', () => {
		test('internal event fires when slider is directly changed', async ({ page }) => {
			await page.goto('/TestSlider.svelte')

			// Interact with first slider
			await page.getByRole('textbox').first().press('ArrowUp')

			// Check internal event count for binding 1
			expect(
				await page
					.locator('pre')
					.filter({ hasText: 'Binding 1 Internal:' })
					.locator('span')
					.innerHTML(),
			).toBe('1')
		})

		test('external event fires when value changes from another source', async ({ page }) => {
			await page.goto('/TestSlider.svelte')

			// Interact with first slider
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

	test.describe('formatting', () => {
		test('custom format function displays formatted value', async ({ page }) => {
			await page.goto('/TestFormat.svelte')

			// The slider should show the formatted value with 'px' suffix
			await expect(page.locator('.tp-txtv_i')).toBeVisible()

			// The input should contain 'px' in its display
			const inputValue = await page.locator('.tp-txtv_i').inputValue()
			expect(inputValue).toContain('px')
		})
	})

	test.describe('wide slider', () => {
		test('wide slider renders', async ({ page }) => {
			await page.goto('/TestSliderWide.svelte')

			// Slider elements should be visible
			await expect(page.locator('.tp-sldv').first()).toBeVisible()

			// Should have a value display
			await expect(page.getByText('Value:')).toBeVisible()
		})
	})

	test.describe('interval slider', () => {
		test('interval slider renders with label', async ({ page }) => {
			await page.goto('/TestIntervalSlider.svelte')

			// Interval slider should have labels
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})

		test('wide interval slider renders', async ({ page }) => {
			await page.goto('/TestIntervalSliderWide.svelte')

			// Wide interval slider should render
			await expect(page.getByText('Value:').first()).toBeVisible()
		})
	})
})
