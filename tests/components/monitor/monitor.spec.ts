import { expect, test } from '@playwright/test'

// Bezier segments use cubic curve commands, linear segments use line commands
const bezierSegmentPattern = / C /v

test.describe('Monitor components', () => {
	test.describe('FpsGraph', () => {
		test('fps graph renders', async ({ page }) => {
			await page.goto('/TestFpsEvent.svelte')

			// FPS graph should render with label
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})

	test.describe('WaveformMonitor', () => {
		test('lineStyle bezier draws curve segments', async ({ page }) => {
			await page.goto('/WaveformMonitorExample.svelte')

			await expect(page.locator('.tp-wfmv_g path').first()).toHaveAttribute(
				'd',
				bezierSegmentPattern,
			)
		})
	})
})
