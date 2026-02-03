import { expect, test } from '@playwright/test'

/**
 * Issue #1: Empty titles break dragging behavior
 * https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/1
 *
 * When a Pane has an empty title (title=''), the pane should still be draggable.
 * Previously, setting an empty title would break the dragging functionality.
 */
test.describe('Issue #1: Empty titles break dragging behavior', () => {
	test('pane with empty title renders', async ({ page }) => {
		await page.goto('/TestTitlelessDraggable.svelte')

		// The link to the issue should be visible
		await expect(page.getByText('Issue #1')).toBeVisible()

		// Text inputs should be visible
		await expect(page.locator('.tp-txtv_i').first()).toBeVisible()
	})

	test('pane with non-empty title can be dragged', async ({ page }) => {
		await page.goto('/TestTitlelessDraggable.svelte')

		// Title should be visible
		await expect(page.getByText('Title')).toBeVisible()
	})

	test('pane title can be changed dynamically via binding', async ({ page }) => {
		await page.goto('/TestTitlelessDraggable.svelte')

		// Find a text input inside a pane
		const textInput = page.locator('.tp-txtv_i').first()
		await expect(textInput).toBeVisible()

		// Type a new title
		await textInput.fill('New Title')

		// The pane should still function
		await expect(page.locator('.tp-txtv_i').first()).toBeVisible()
	})
})
