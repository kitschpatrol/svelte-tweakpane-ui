import { expect, test } from '@playwright/test'

test.describe('Rotation components', () => {
	test.describe('Euler rotation', () => {
		test('euler rotation input renders', async ({ page }) => {
			await page.goto('/TestRotationEuler.svelte')

			// Should have rotation-related inputs
			await expect(page.locator('.tp-txtv_i').first()).toBeVisible()
		})
	})

	test.describe('Quaternion rotation', () => {
		test('quaternion rotation input renders', async ({ page }) => {
			await page.goto('/TestRotationQuaternion.svelte')

			// Should have rotation-related inputs
			await expect(page.locator('.tp-txtv_i').first()).toBeVisible()
		})
	})
})
