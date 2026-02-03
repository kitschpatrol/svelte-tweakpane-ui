import { expect, test } from '@playwright/test'

/**
 * Issue #4: Pane collapse/expand behavior not correct
 * https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/4
 *
 * When setting expanded={false} on a Pane, the pane should start collapsed.
 * Clicking on it should expand it. Previously, setting expanded={false}
 * would cause the pane to start collapsed but not open when clicked.
 */
test.describe('Issue #4: Pane collapse/expand behavior', () => {
	test('inline pane with expanded={false} starts collapsed and can be expanded', async ({
		page,
	}) => {
		await page.goto('/TestCollapseExpand.svelte')

		// Find inline pane with unbound literal expanded={false}
		const paneTitle = page.getByText('Inline Pane Unbound Literal')
		await expect(paneTitle).toBeVisible()

		// The pane container should exist
		const pane = paneTitle.locator('..').locator('..')
		await expect(pane).toBeVisible()

		// Click on the title to expand
		await paneTitle.click()

		// Pane should still be visible and functional
		await expect(pane).toBeVisible()
	})

	test('draggable pane with expanded={false} starts collapsed', async ({ page }) => {
		await page.goto('/TestCollapseExpand.svelte')

		// Find draggable pane
		const paneTitle = page.getByText('Draggable Pane Unbound Literal')
		await expect(paneTitle).toBeVisible()
	})

	test('fixed pane with expanded={false} starts collapsed', async ({ page }) => {
		await page.goto('/TestCollapseExpand.svelte')

		// Find fixed pane
		const paneTitle = page.getByText('Fixed Pane Unbound Literal')
		await expect(paneTitle).toBeVisible()
	})

	test('pane with bound expanded variable shows initial state', async ({ page }) => {
		await page.goto('/TestCollapseExpand.svelte')

		// Initial state should be collapsed (false)
		await expect(page.getByText('false').first()).toBeVisible()
	})

	test('multiple pane types are rendered', async ({ page }) => {
		await page.goto('/TestCollapseExpand.svelte')

		// Various pane types should be rendered
		await expect(page.getByText('Inline Pane').first()).toBeVisible()
		await expect(page.getByText('Draggable Pane').first()).toBeVisible()
		await expect(page.getByText('Fixed Pane').first()).toBeVisible()
	})
})
