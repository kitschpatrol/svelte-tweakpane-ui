import { expect, test } from '@playwright/test'

test.describe('Other control components', () => {
	test.describe('Ring', () => {
		test('ring input renders with label', async ({ page }) => {
			await page.goto('/TestRing.svelte')

			// Ring should have labels
			await expect(page.getByText('Ring 1').first()).toBeVisible()
		})

		test('wide ring input renders', async ({ page }) => {
			await page.goto('/TestRingWide.svelte')

			// Wide ring should render
			await expect(page.getByText('Value:').first()).toBeVisible()
		})
	})

	test.describe('Wheel', () => {
		test('wheel input renders with label', async ({ page }) => {
			await page.goto('/TestWheel.svelte')

			// Wheel should have labels
			await expect(page.getByText('Wheel 1').first()).toBeVisible()
		})

		test('wide wheel input renders', async ({ page }) => {
			await page.goto('/TestWheelWide.svelte')

			// Wide wheel should render
			await expect(page.getByText('Value:').first()).toBeVisible()
		})
	})

	test.describe('Scale', () => {
		test('scale input renders', async ({ page }) => {
			await page.goto('/TestScale.svelte')

			// Scale should have text inputs
			await expect(page.locator('.tp-txtv_i').first()).toBeVisible()
		})
	})

	test.describe('CubicBezier', () => {
		test('cubic bezier editor renders', async ({ page }) => {
			await page.goto('/TestCubicBezier.svelte')

			// Cubic bezier should render with label
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})

	test.describe('RadioGrid', () => {
		test('radio grid renders', async ({ page }) => {
			await page.goto('/TestRadioGrid.svelte')

			// Radio grid should have label
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})

	test.describe('File', () => {
		test('file input renders with label', async ({ page }) => {
			await page.goto('/TestFile.svelte')

			// File input should have labels
			await expect(page.getByText('File 1').first()).toBeVisible()
		})
	})

	test.describe('Image', () => {
		test('image input renders', async ({ page }) => {
			await page.goto('/TestImage.svelte')

			// Image input should render
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})
})
