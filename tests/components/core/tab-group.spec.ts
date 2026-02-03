import { expect, test } from '@playwright/test'

test.describe('TabGroup component', () => {
	test.describe('basic tab switching', () => {
		test('clicking tab button switches to that tab', async ({ page }) => {
			await page.goto('/TestTabIndexBinding.svelte')

			// Initial state - Tab B should be selected (index 1)
			await expect(page.getByText('TabIndex: 1')).toBeVisible()
			await expect(page.getByRole('button', { exact: true, name: 'B' }).locator('..')).toHaveClass(
				'tp-tbiv tp-tbiv-sel',
			)

			// Click Tab A
			await page.getByRole('button', { exact: true, name: 'A' }).click()

			// Tab A should now be selected
			await expect(page.getByText('TabIndex: 0')).toBeVisible()
			await expect(page.getByRole('button', { exact: true, name: 'A' }).locator('..')).toHaveClass(
				'tp-tbiv tp-tbiv-sel',
			)
		})
	})

	test.describe('selectedIndex binding', () => {
		test('selectedIndex updates when tab is selected', async ({ page }) => {
			await page.goto('/TestTabIndexBinding.svelte')

			// Select tab A
			await page.getByRole('button', { exact: true, name: 'A' }).click()
			await expect(page.getByText('TabIndex: 0')).toBeVisible()

			// Select tab B
			await page.getByRole('button', { exact: true, name: 'B' }).click()
			await expect(page.getByText('TabIndex: 1')).toBeVisible()
		})

		test('tab selection persists when switching pane modes', async ({ page }) => {
			await page.goto('/TestTabIndexBinding.svelte')

			// Initial state: Mode 0, Tab B selected
			await expect(page.getByText('Mode: 0')).toBeVisible()
			await expect(page.getByText('TabIndex: 1')).toBeVisible()

			// Cycle to mode 1
			await page.getByRole('button', { name: 'Cycle Mode' }).first().click()
			await expect(page.getByText('Mode: 1')).toBeVisible()

			// Tab index should be preserved
			await expect(page.getByText('TabIndex: 1')).toBeVisible()
			await expect(page.getByRole('button', { exact: true, name: 'B' }).locator('..')).toHaveClass(
				'tp-tbiv tp-tbiv-sel',
			)
		})
	})

	test.describe('nested tabs', () => {
		test('nested tab groups render correctly', async ({ page }) => {
			await page.goto('/TestTabsNested.svelte')

			// Page should load with tab groups
			await expect(page.locator('.tp-tbiv').first()).toBeVisible()
		})
	})

	test.describe('tab sorting', () => {
		test('tabs can be sorted', async ({ page }) => {
			await page.goto('/TestTabsSort.svelte')

			// Tab group should render
			await expect(page.locator('.tp-tbiv').first()).toBeVisible()
		})
	})

	test.describe('alternative binding patterns', () => {
		test('alternative tab index binding works', async ({ page }) => {
			await page.goto('/TestTabIndexBindingAlt.svelte')

			// Component should render with tabs
			await expect(page.locator('.tp-tbiv').first()).toBeVisible()
		})
	})
})
