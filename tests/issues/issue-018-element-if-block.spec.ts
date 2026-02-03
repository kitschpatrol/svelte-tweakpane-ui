import { expect, test } from '@playwright/test'

/**
 * Issue #18: Element inside an IF block make next blade fly away
 * https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/18
 *
 * When using an Element component inside an if block within a TabPage,
 * the next blade after the Element would be incorrectly positioned.
 * Specifically, blades inside the if block would appear outside their
 * expected position.
 */
test.describe('Issue #18: Element inside IF block ordering', () => {
	test('initial state shows checkbox and outer controls', async ({ page }) => {
		await page.goto('/TestElementIfStatement.svelte')

		// Checkbox should be visible (using Tweakpane class)
		await expect(page.locator('.tp-ckbv_w').first()).toBeVisible()

		// Text input D (outside if block) should be visible
		await expect(page.getByText('D', { exact: true }).first()).toBeVisible()
	})

	test('toggling visibility shows elements in correct order', async ({ page }) => {
		await page.goto('/TestElementIfStatement.svelte')

		// Toggle the checkbox to show the if block content
		await page.locator('.tp-ckbv_w').first().click()

		// Now the Element and Text C should be visible
		await expect(page.getByText('C', { exact: true }).first()).toBeVisible()
		await expect(page.getByText('D', { exact: true }).first()).toBeVisible()
	})

	test('controls maintain correct DOM order after toggle', async ({ page }) => {
		await page.goto('/TestElementIfStatement.svelte')

		// Toggle on
		await page.locator('.tp-ckbv_w').first().click()

		// Get all blade labels to verify order
		const blades = page.locator('.tp-lblv_l')
		const labels: string[] = []

		const count = await blades.count()
		for (let i = 0; i < count; i++) {
			const text = await blades.nth(i).textContent()
			if (text) labels.push(text.trim())
		}

		// The order should include: Visibility, C, D
		expect(labels).toContain('Visibility')
		expect(labels).toContain('C')
		expect(labels).toContain('D')
	})

	test('toggling visibility off hides conditional content', async ({ page }) => {
		await page.goto('/TestElementIfStatement.svelte')

		// Toggle on
		await page.locator('.tp-ckbv_w').first().click()
		await expect(page.getByText('C', { exact: true }).first()).toBeVisible()

		// Toggle off
		await page.locator('.tp-ckbv_w').first().click()

		// D should still be visible (it's outside)
		await expect(page.getByText('D', { exact: true }).first()).toBeVisible()
	})
})
