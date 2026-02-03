import { expect, test } from '@playwright/test'

/**
 * Issue #7: Draggable Pane sticks to cursor when dragging operation is interrupted
 * https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/7
 *
 * When dragging a pane and the operation is interrupted (e.g., Alt+Tab),
 * the pane would stick to the cursor. This was fixed by adding a
 * pointercancel event listener.
 */
test.describe('Issue #7: Draggable Pane sticks to cursor', () => {
	test('draggable panes are rendered', async ({ page }) => {
		await page.goto('/TestCollapseExpand.svelte')

		// Find a draggable pane title
		await expect(page.getByText('Draggable Pane').first()).toBeVisible()
	})

	test('pane title bar is visible for dragging', async ({ page }) => {
		await page.goto('/TestCollapseExpand.svelte')

		// Find the title bar elements
		const titleBar = page.locator('.tp-rotv_t').first()
		await expect(titleBar).toBeVisible()
	})
})
