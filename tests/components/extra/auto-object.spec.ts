import { expect, test } from '@playwright/test'

test.describe('AutoObject component', () => {
	test.describe('basic functionality', () => {
		test('auto-generates controls for object properties', async ({ page }) => {
			await page.goto('/TestAutoObject.svelte')

			// Should have generated a checkbox for boolean (note: label is prettified)
			await expect(page.getByText('Some Boolean').first()).toBeVisible()

			// Should have generated a slider for number
			await expect(page.getByText('Some Number').first()).toBeVisible()

			// Should have generated a text input for string
			await expect(page.getByText('Some String').first()).toBeVisible()
		})

		test('creates folder for nested objects', async ({ page }) => {
			await page.goto('/TestAutoObject.svelte')

			// Should have a folder for the nested object
			await expect(page.getByText('Some Folder').first()).toBeVisible()
		})

		test('creates color picker for RGB objects', async ({ page }) => {
			await page.goto('/TestAutoObject.svelte')

			// Should have a color picker for the color object
			await expect(page.getByText('Some Color').first()).toBeVisible()

			// Should have color swatch
			await expect(page.locator('.tp-colswv').first()).toBeVisible()
		})

		test('creates point input for x/y objects', async ({ page }) => {
			await page.goto('/TestAutoObject.svelte')

			// Should have a point input
			await expect(page.getByText('Some Point').first()).toBeVisible()
		})
	})

	test.describe('value display', () => {
		test('displays object value as JSON', async ({ page }) => {
			await page.goto('/TestAutoObject.svelte')

			// Value should be displayed
			await expect(page.getByText('Value:').first()).toBeVisible()
		})

		test('shows event counters', async ({ page }) => {
			await page.goto('/TestAutoObject.svelte')

			// Event counters should be visible
			await expect(page.locator('pre').filter({ hasText: 'Binding 1 Internal:' })).toBeVisible()
			await expect(page.locator('pre').filter({ hasText: 'Binding 2 External:' })).toBeVisible()
		})
	})

	test.describe('nested objects', () => {
		test('handles deeply nested objects', async ({ page }) => {
			await page.goto('/TestAutoObjectNesting.svelte')

			// Should render with labels
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})
})
