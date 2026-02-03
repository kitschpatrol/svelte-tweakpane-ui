import { expect, test } from '@playwright/test'

test.describe('Text component', () => {
	test.describe('basic functionality', () => {
		test('text input renders and accepts input', async ({ page }) => {
			await page.goto('/TestText.svelte')

			// Find the text input
			const textInput = page.locator('.tp-txtv_i').first()
			await expect(textInput).toBeVisible()

			// Clear and type new text
			await textInput.fill('Hello World')

			// Value should update
			await expect(textInput).toHaveValue('Hello World')
		})
	})

	test.describe('string type detection', () => {
		test('text component detects string types correctly', async ({ page }) => {
			await page.goto('/TestTextStringDetection.svelte')

			// Component should render with text inputs
			await expect(page.locator('.tp-txtv_i').first()).toBeVisible()
		})
	})

	test.describe('textarea', () => {
		test('textarea renders for multiline text', async ({ page }) => {
			await page.goto('/TestTextarea.svelte')

			// Textarea should have label elements
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})
})
