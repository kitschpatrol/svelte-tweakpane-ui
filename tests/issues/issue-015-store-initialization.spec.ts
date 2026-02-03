import { expect, test } from '@playwright/test'

/**
 * Issue #15: Slider does not react immediately to store values updated in onMount
 * https://github.com/kitschpatrol/svelte-tweakpane-ui/issues/15
 *
 * When updating a store value in onMount, the Slider component would not
 * pick up the new value immediately. The fix involved using Svelte's tick()
 * to ensure the component updates after the store change.
 */
test.describe('Issue #15: Slider store initialization', () => {
	test('slider shows correct value after store update in onMount with tick', async ({ page }) => {
		await page.goto('/TestStoreInitialization.svelte')

		// Wait for the component to mount and update
		await page.waitForTimeout(100)

		// Find the section "With tick, works in Svelte 4"
		const section = page.locator('h1').filter({ hasText: 'With tick' })
		await expect(section).toBeVisible()

		// The native input should show 60
		const nativeInput = page.locator('input[type="range"]').first()
		await expect(nativeInput).toHaveValue('60')

		// The Tweakpane slider should also reflect the value (60)
		// The slider input should have a value close to 60
		const tpSliderInput = page.locator('.tp-txtv_i').first()
		const value = await tpSliderInput.inputValue()
		expect(Number(value)).toBe(60)
	})

	test('slider shows correct value after store update without tick (Svelte 5)', async ({
		page,
	}) => {
		await page.goto('/TestStoreInitialization.svelte')

		// Wait for the component to mount and update
		await page.waitForTimeout(100)

		// Find the section "Without tick, works in Svelte 5"
		const section = page.locator('h1').filter({ hasText: 'Without tick' })
		await expect(section).toBeVisible()

		// The native input in second section should show 60
		const nativeInput = page.locator('input[type="range"]').nth(1)
		await expect(nativeInput).toHaveValue('60')
	})
})
