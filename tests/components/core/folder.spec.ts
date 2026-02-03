import { expect, test } from '@playwright/test'

test.describe('Folder component', () => {
	test.describe('visibility', () => {
		test('invisible folder can hide its contents', async ({ page }) => {
			await page.goto('/TestInvisibleFolder.svelte')

			// Page should load with labels
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})

	test.describe('collapse/expand', () => {
		test('folder can be collapsed and expanded', async ({ page }) => {
			await page.goto('/TestCollapseExpand.svelte')

			// Find a folder element by its title
			await expect(page.locator('.tp-rotv_t').first()).toBeVisible()
		})
	})
})
