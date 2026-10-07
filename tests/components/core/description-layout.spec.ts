import type { Locator } from '@playwright/test'
import { expect, test } from '@playwright/test'

async function boundingBox(locator: Locator) {
	const bounds = await locator.boundingBox()
	if (bounds === null) {
		throw new Error('Expected element to have a bounding box')
	}

	return bounds
}

async function descriptionLayout(locator: Locator) {
	return locator.evaluate((element) => {
		const style = getComputedStyle(element)
		const bounds = element.getBoundingClientRect()
		const scale = bounds.width / Number(style.width.replace('px', ''))
		const range = document.createRange()
		range.selectNodeContents(element)
		const lines = [...range.getClientRects()].filter((line) => line.width > 0)
		const padding =
			Number(style.paddingLeft.replace('px', '')) + Number(style.paddingRight.replace('px', ''))
		return {
			emptyWidth: (bounds.width - Math.max(...lines.map((line) => line.width))) / scale - padding,
			lineCount: lines.length,
			width: bounds.width / scale,
		}
	})
}

test.describe('Description layout', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/TestDescription.svelte')
		await expect(page.locator('[role="tooltip"]')).toHaveCount(12)
	})

	test('fits balanced lines and refits updated text without changing its line breaks', async ({
		page,
	}) => {
		const errors: Error[] = []
		page.on('pageerror', (error) => {
			errors.push(error)
		})
		const tooltip = page.locator('[role="tooltip"]').first()
		await tooltip.evaluate((element) => {
			element.textContent = 'Controls the overall scene brightness.'
			element.parentElement!.style.setProperty('--stui-description-max-width', '230px')
		})
		await page.getByText('Glow', { exact: true }).hover()
		await expect(tooltip).toBeVisible()
		const initial = await descriptionLayout(tooltip)
		expect(initial.lineCount).toBe(2)
		expect(initial.width).toBeLessThan(160)
		expect(initial.emptyWidth).toBeGreaterThanOrEqual(-0.1)
		expect(initial.emptyWidth).toBeLessThan(1)

		// An open tooltip must be able to grow again after fitting a shorter description.
		await tooltip.evaluate((element) => {
			element.textContent = 'A much longer description that should use the available width again.'
		})
		await expect
			.poll(async () => {
				const measurement = await descriptionLayout(tooltip)
				return measurement.width
			})
			.toBeGreaterThan(initial.width)
		await expect
			.poll(async () => {
				const measurement = await descriptionLayout(tooltip)
				return measurement.emptyWidth
			})
			.toBeLessThan(1)

		await tooltip.evaluate((element) => {
			element.textContent = 'First line\nSecond line\nThird'
		})
		await expect
			.poll(async () => {
				const measurement = await descriptionLayout(tooltip)
				return measurement.lineCount
			})
			.toBe(3)
		await expect
			.poll(async () => {
				const measurement = await descriptionLayout(tooltip)
				return measurement.emptyWidth
			})
			.toBeLessThan(1)
		await page.getByRole('button', { name: 'Update description' }).dispatchEvent('click')
		await expect(tooltip).toHaveText('Updated description')
		await expect
			.poll(async () => {
				const measurement = await descriptionLayout(tooltip)
				return measurement.lineCount
			})
			.toBe(1)
		await expect
			.poll(async () => {
				const measurement = await descriptionLayout(tooltip)
				return measurement.emptyWidth
			})
			.toBeLessThan(1)
		expect(errors).toEqual([])
	})

	test('refits scaled descriptions when inherited styles and the viewport change', async ({
		page,
	}) => {
		await page.goto('/TestDescriptionScale.svelte')
		const tooltip = page.locator('[role="tooltip"]')
		await tooltip.evaluate((element) => {
			element.textContent = 'Controls the overall scene brightness.'
		})
		await page.locator('body').evaluate((element) => {
			element.style.setProperty('--stui-description-max-width', '230px')
		})
		const label = page.getByText('Scaled', { exact: true })
		await label.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
		const initial = await descriptionLayout(tooltip)
		expect(initial.lineCount).toBe(2)
		expect(initial.emptyWidth).toBeGreaterThanOrEqual(-0.1)
		expect(initial.emptyWidth).toBeLessThan(1)

		// Raising the cap does not resize the fitted box until its natural size is measured again.
		await page.locator('body').evaluate((element) => {
			element.style.setProperty('--stui-description-max-width', '400px')
		})
		await expect
			.poll(async () => {
				const measurement = await descriptionLayout(tooltip)
				return measurement.lineCount
			})
			.toBe(1)
		const expanded = await boundingBox(tooltip)
		await page.setViewportSize({ height: 720, width: 240 })
		await expect
			.poll(async () => {
				const measurement = await boundingBox(tooltip)
				return measurement.width
			})
			.toBeLessThanOrEqual(208)
		await expect
			.poll(async () => {
				const measurement = await descriptionLayout(tooltip)
				return measurement.emptyWidth
			})
			.toBeLessThan(1)
		const narrow = await boundingBox(tooltip)
		expect(narrow.x).toBeGreaterThanOrEqual(16)
		expect(narrow.x + narrow.width).toBeLessThanOrEqual(224.1)
		await page.setViewportSize({ height: 720, width: 1280 })
		await expect
			.poll(async () => {
				const measurement = await boundingBox(tooltip)
				return measurement.width
			})
			.toBeCloseTo(expanded.width, 0)

		await page.locator('.svelte-tweakpane-ui').evaluate((element) => {
			element.style.setProperty('--tp-base-font-size', '14px')
			element.style.setProperty('--tp-container-horizontal-padding', '9px')
		})
		await expect
			.poll(async () => {
				const measurement = await boundingBox(tooltip)
				return measurement.width
			})
			.toBeGreaterThan(expanded.width)
		await expect
			.poll(async () => {
				const measurement = await descriptionLayout(tooltip)
				return measurement.emptyWidth
			})
			.toBeLessThan(1)

		await tooltip.evaluate((element) => {
			element.textContent = 'https://example.com/' + 'unbroken'.repeat(30)
		})
		await expect
			.poll(async () => {
				const measurement = await descriptionLayout(tooltip)
				return measurement.lineCount
			})
			.toBeGreaterThan(3)
		const unbroken = await descriptionLayout(tooltip)
		expect(unbroken.width).toBeLessThanOrEqual(400)
		expect(unbroken.emptyWidth).toBeGreaterThanOrEqual(-0.1)
		expect(unbroken.emptyWidth).toBeLessThan(1)
	})
})
