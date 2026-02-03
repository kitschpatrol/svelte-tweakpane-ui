import { expect, test } from '@playwright/test'

/**
 * Issue #31: Tab Group selectedIndex binding gets set to -1 when switching Pane Position
 * https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/31
 *
 * When reactively switching between Pane positions (e.g., inline vs draggable),
 * the TabGroup's selectedIndex binding would incorrectly get set to -1.
 * This test verifies that the tab index is preserved when cycling through
 * different pane position modes.
 */
test.describe('Issue #31: Tab Group selectedIndex binding with Pane position changes', () => {
	test('initial state shows correct mode and tab index', async ({ page }) => {
		await page.goto('/TestTabIndexBinding.svelte')

		// Mode should be 0 (draggable)
		await expect(page.getByText('Mode: 0')).toBeVisible()

		// Tab index should be 1 (Tab B)
		await expect(page.getByText('TabIndex: 1')).toBeVisible()

		// Tab B should be selected
		await expect(page.getByRole('button', { exact: true, name: 'B' }).locator('..')).toHaveClass(
			'tp-tbiv tp-tbiv-sel',
		)
	})

	test('tab selection works in draggable mode', async ({ page }) => {
		await page.goto('/TestTabIndexBinding.svelte')

		// Select tab A
		await page.getByRole('button', { exact: true, name: 'A' }).click()
		await expect(page.getByText('TabIndex: 0')).toBeVisible()
		await expect(page.getByRole('button', { exact: true, name: 'A' }).locator('..')).toHaveClass(
			'tp-tbiv tp-tbiv-sel',
		)

		// Select tab B
		await page.getByRole('button', { exact: true, name: 'B' }).click()
		await expect(page.getByText('TabIndex: 1')).toBeVisible()
		await expect(page.getByRole('button', { exact: true, name: 'B' }).locator('..')).toHaveClass(
			'tp-tbiv tp-tbiv-sel',
		)
	})

	test('tab index is preserved when cycling to inline mode', async ({ page }) => {
		await page.goto('/TestTabIndexBinding.svelte')

		// Initial: Mode 0, Tab B
		await expect(page.getByText('Mode: 0')).toBeVisible()
		await expect(page.getByText('TabIndex: 1')).toBeVisible()

		// Cycle to mode 1 (inline)
		await page.getByRole('button', { name: 'Cycle Mode' }).first().click()

		// Mode should be 1
		await expect(page.getByText('Mode: 1')).toBeVisible()

		// Tab index should still be 1 (NOT -1)
		await expect(page.getByText('TabIndex: 1')).toBeVisible()

		// Tab B should still be selected
		await expect(page.getByRole('button', { exact: true, name: 'B' }).locator('..')).toHaveClass(
			'tp-tbiv tp-tbiv-sel',
		)
	})

	test('tab selection works after mode change', async ({ page }) => {
		await page.goto('/TestTabIndexBinding.svelte')

		// Cycle to mode 1
		await page.getByRole('button', { name: 'Cycle Mode' }).first().click()
		await expect(page.getByText('Mode: 1')).toBeVisible()

		// Select tab A
		await page.getByRole('button', { exact: true, name: 'A' }).click()
		await expect(page.getByText('TabIndex: 0')).toBeVisible()

		// Select tab B
		await page.getByRole('button', { exact: true, name: 'B' }).click()
		await expect(page.getByText('TabIndex: 1')).toBeVisible()
	})

	test('tab index preserved through multiple mode cycles', async ({ page }) => {
		await page.goto('/TestTabIndexBinding.svelte')

		// Select tab A first
		await page.getByRole('button', { exact: true, name: 'A' }).click()
		await expect(page.getByText('TabIndex: 0')).toBeVisible()

		// Cycle through all modes
		// Mode 0 -> 1
		await page.getByRole('button', { name: 'Cycle Mode' }).first().click()
		await expect(page.getByText('Mode: 1')).toBeVisible()
		await expect(page.getByText('TabIndex: 0')).toBeVisible()

		// Mode 1 -> 2 (no pane mode)
		await page.getByRole('button', { name: 'Cycle Mode' }).first().click()
		await expect(page.getByText('Mode: 2')).toBeVisible()
		await expect(page.getByText('TabIndex: 0')).toBeVisible()
	})

	test('tab index never becomes -1 during mode transitions', async ({ page }) => {
		await page.goto('/TestTabIndexBinding.svelte')

		// Perform multiple transitions and verify index never becomes -1
		for (let i = 0; i < 6; i++) {
			// Check that tab index is not -1
			await expect(page.getByText('TabIndex: -1')).not.toBeVisible()

			// Only click cycle mode if not in mode 2 (no pane)
			const modeText = await page.locator('p').filter({ hasText: 'Mode:' }).textContent()
			if (modeText?.includes('Mode: 2')) {
				// Skip - no button available in mode 2
				break
			}

			const cycleButton = page.getByRole('button', { name: 'Cycle Mode' }).first()
			if (await cycleButton.isVisible()) {
				await cycleButton.click()
			} else {
				break
			}
		}
	})
})
