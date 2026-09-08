import type { Locator } from '@playwright/test'
import { expect, test } from '@playwright/test'

const WHITESPACE_PATTERN = /\s+/v

async function boundingBox(locator: Locator) {
	const bounds = await locator.boundingBox()
	if (bounds === null) {
		throw new Error('Expected element to have a bounding box')
	}

	return bounds
}

async function caretStyle(locator: Locator) {
	return locator.evaluate((element) => {
		const caret = getComputedStyle(element, '::before')
		return {
			background: getComputedStyle(element).backgroundColor,
			bottomColor: caret.borderBottomColor,
			content: caret.content,
			left: Number(caret.left.replace('px', '')),
			topColor: caret.borderTopColor,
		}
	})
}

test.describe('Control descriptions', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/TestDescription.svelte')
		await expect(page.locator('[role="tooltip"]')).toHaveCount(12)
	})

	test('adds descriptions to bindings, blades, and buttons', async ({ page }) => {
		const describedBlades = page.locator('[data-stui-description]')
		const tooltips = page.locator('[role="tooltip"]')

		await expect(describedBlades).toHaveCount(12)
		await expect(tooltips).toHaveCount(12)
		await expect(tooltips.first()).toHaveText('Adjusts the amount of glow.\nUse sparingly.')
		const supportsHint = await page.evaluate(() => {
			const element = document.createElement('div')
			element.popover = 'hint'
			return element.popover === 'hint'
		})
		await expect(tooltips.first()).toHaveAttribute('popover', supportsHint ? 'hint' : 'manual')
		await expect(describedBlades.first().locator('.tp-lblv_l')).not.toHaveAttribute('title')
		await expect(describedBlades.first()).not.toHaveAttribute('title')
	})

	test('connects interactive controls to their descriptions', async ({ page }) => {
		const glowRow = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const description = glowRow.locator('[role="tooltip"]')
		const descriptionId = await description.getAttribute('id')
		const controls = await glowRow.locator('[aria-describedby]').all()

		expect(descriptionId).not.toBeNull()
		expect(controls.length).toBeGreaterThan(0)
		await expect(glowRow.locator('input')).toHaveAccessibleDescription(
			'Adjusts the amount of glow. Use sparingly.',
		)
		for (const control of controls) {
			const describedBy = await control.getAttribute('aria-describedby')
			expect(describedBy?.split(WHITESPACE_PATTERN)).toContain(descriptionId)
		}
	})

	test('matches the pane scale after entering the top layer', async ({ page }) => {
		await page.goto('/TestDescriptionScale.svelte')

		const pane = page.locator('.svelte-tweakpane-ui')
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Scaled', { exact: true }),
		})
		const label = row.locator('.tp-lblv_l')
		const tooltip = row.locator('[role="tooltip"]')

		await label.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()

		const paneRenderScale = await pane.evaluate(
			(element) => element.getBoundingClientRect().width / (element as HTMLElement).offsetWidth,
		)
		const tooltipRenderScale = await tooltip.evaluate(
			(element) => element.getBoundingClientRect().width / (element as HTMLElement).offsetWidth,
		)
		expect(paneRenderScale).toBeCloseTo(2, 1)
		expect(tooltipRenderScale).toBeCloseTo(paneRenderScale, 1)
		const labelBounds = await label.boundingBox()
		const tooltipBounds = await tooltip.boundingBox()
		expect(tooltipBounds?.x).toBeCloseTo(Math.max(16, (labelBounds?.x ?? 0) + 12 - 16), 0)
		const caret = await caretStyle(tooltip)
		expect(caret.content).toBe('""')
		expect(caret.bottomColor).toBe(caret.background)
		expect((tooltipBounds?.x ?? 0) + caret.left * 2).toBeCloseTo((labelBounds?.x ?? 0) + 12, 0)
		expect(tooltipBounds?.y).toBeGreaterThanOrEqual(
			(labelBounds?.y ?? 0) + (labelBounds?.height ?? 0),
		)
	})

	test('appends an optional CSS hint that truncates with the label', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Labeled Wide Slider', { exact: true }),
		})
		const label = row.locator('.tp-lblv_l')
		const hintContent = async () =>
			label.evaluate((element) => getComputedStyle(element, '::after').content)
		const tooltip = row.locator('[role="tooltip"]')
		const hintSelect = page
			.locator('.tp-lblv')
			.filter({ has: page.getByText('Hint', { exact: true }) })
			.getByRole('combobox')

		await expect(label.locator('*')).toHaveCount(0)
		await expect.poll(hintContent).toBe('none')
		await hintSelect.selectOption('(i)')
		await expect.poll(hintContent).toBe('"(i)" / ""')
		await expect(label).toMatchAriaSnapshot('- text: Labeled Wide Slider')

		const hintPosition = await label.evaluate((element) => {
			const range = document.createRange()
			range.selectNodeContents(element)
			const bounds = range.getBoundingClientRect()
			return { x: bounds.right + 2, y: bounds.top + bounds.height / 2 }
		})
		await page.mouse.move(hintPosition.x, hintPosition.y)
		await expect(tooltip).toBeVisible()

		await label.evaluate((element) => {
			element.style.flex = '0 0 48px'
		})
		expect(await label.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true)
		await expect(label).toHaveCSS('overflow-x', 'hidden')
		await expect(label).toHaveCSS('text-overflow', 'ellipsis')
		await hintSelect.hover()
		await expect(tooltip).toBeHidden()

		await label.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()

		await hintSelect.selectOption('"?"')
		await expect.poll(hintContent).toBe(String.raw`"\"?\"" / ""`)
		await expect(label).toMatchAriaSnapshot('- text: Labeled Wide Slider')
		await hintSelect.selectOption('')
		await expect.poll(hintContent).toBe('none')
	})

	test('opens after a delay and stays open while crossing into the tooltip', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const label = row.locator('.tp-lblv_l')
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('[aria-describedby]').first().hover()
		await expect(tooltip).toBeHidden()

		const labelBounds = await label.boundingBox()
		expect(labelBounds).not.toBeNull()
		await label.hover({ position: { x: 12, y: 8 } })
		expect(await tooltip.evaluate((element) => element.matches(':popover-open'))).toBe(false)
		await page.waitForTimeout(400)
		await expect(tooltip).toBeHidden()
		await expect(tooltip).toBeVisible()

		const tooltipBounds = await tooltip.boundingBox()
		expect(tooltipBounds).not.toBeNull()
		const tooltipMargin = await tooltip.evaluate((element) =>
			Number(getComputedStyle(element).marginTop.replace('px', '')),
		)
		expect(tooltipBounds?.x).toBeCloseTo((labelBounds?.x ?? 0) + 12 - 8, 0)

		expect(tooltipBounds?.y).toBeCloseTo(
			(labelBounds?.y ?? 0) + (labelBounds?.height ?? 0) + tooltipMargin,
			0,
		)
		await expect(tooltip).toHaveCSS('overflow', 'visible')
		await expect(tooltip).toHaveCSS('text-align', 'left')
		expect(
			await tooltip.evaluate(
				(element) => getComputedStyle(element).transitionDuration.split(',', 1)[0],
			),
		).toBe('0.05s')

		for (let y = (labelBounds?.y ?? 0) + 8; y < (tooltipBounds?.y ?? 0) + 4; y += 2) {
			await page.mouse.move((labelBounds?.x ?? 0) + 12, y)
			await page.waitForTimeout(40)
		}

		await page.waitForTimeout(300)
		await expect(tooltip).toBeVisible()
	})

	test('pins the horizontal pointer position when opening until the next hover', async ({
		page,
	}) => {
		const label = page.getByText('Labeled Wide Slider', { exact: true })
		const tooltip = label.locator('..').locator('[role="tooltip"]')
		const source = await boundingBox(label)
		await page.mouse.move(source.x + 8, source.y + source.height / 2)
		await page.waitForTimeout(200)
		await page.mouse.move(source.x + 40, source.y + source.height / 2)
		await expect(tooltip).toBeVisible()
		const initial = await boundingBox(tooltip)
		expect(initial.x).toBeCloseTo(source.x + 40 - 8, 0)
		const initialCaret = await caretStyle(tooltip)
		expect(initial.x + initialCaret.left).toBeCloseTo(source.x + 40, 0)

		await page.mouse.move(source.x + 70, source.y + source.height / 2)
		expect(await boundingBox(tooltip)).toEqual(initial)
		expect(await caretStyle(tooltip)).toEqual(initialCaret)
		await tooltip.hover({ position: { x: 40, y: 5 } })
		await page.waitForTimeout(300)
		await expect(tooltip).toBeVisible()
		expect(await boundingBox(tooltip)).toEqual(initial)

		await page.mouse.move(900, 600)
		await expect(tooltip).toBeHidden()
		await page.mouse.move(source.x + 70, source.y + source.height / 2)
		await expect(tooltip).toBeVisible()
		const reopened = await boundingBox(tooltip)
		expect(reopened.x).toBeCloseTo(source.x + 70 - 8, 0)
	})

	test('keeps cursor-positioned tooltips inside viewport corners at different scales', async ({
		page,
	}) => {
		// Allow subpixel rounding between measured widths and zoomed CSS positioning.
		const edgeTolerance = 0.1
		await page.goto('/TestDescriptionScale.svelte')
		await page.setViewportSize({ height: 600, width: 800 })
		const pane = page.locator('.svelte-tweakpane-ui')
		const label = page.getByText('Scaled', { exact: true })
		const tooltip = page.locator('[role="tooltip"]')
		for (const scale of [2, 1]) {
			if (scale === 1) {
				await page.getByRole('button', { name: 'Toggle scale' }).click()
			}

			await expect(tooltip).toBeHidden()

			await pane.evaluate((element, paneScale) => {
				Object.assign(element.parentElement!.style, {
					bottom: '0',
					left: 'auto',
					position: 'fixed',
					right: '8px',
					width: `${180 * paneScale}px`,
				})
			}, scale)
			await label.hover({ position: { x: 2, y: 8 } })
			await expect(tooltip).toBeVisible()
			const source = await boundingBox(label)
			const corner = await boundingBox(tooltip)
			expect(corner.x).toBeLessThan(source.x)
			expect(corner.x + corner.width).toBeLessThanOrEqual(800 - 8 * scale + edgeTolerance)
			expect(corner.y + corner.height).toBeLessThan(source.y)
			const caret = await caretStyle(tooltip)
			expect(caret.topColor).toBe(caret.background)
			expect(corner.x + caret.left * scale).toBeCloseTo(source.x + 2, 0)

			await tooltip.evaluate((element) => {
				element.textContent = 'A longer description that changes the tooltip width while open.'
			})
			await expect
				.poll(async () => {
					const bounds = await boundingBox(tooltip)
					return bounds.width
				})
				.toBeGreaterThan(corner.width)
			await expect
				.poll(async () => {
					const bounds = await boundingBox(tooltip)
					return bounds.x + bounds.width
				})
				.toBeLessThanOrEqual(800 - 8 * scale + edgeTolerance)

			await page.mouse.move(400, 100)
			await expect(tooltip).toBeHidden()
			await pane.evaluate((element) => {
				Object.assign(element.parentElement!.style, { left: '8px', right: 'auto' })
			})
			await label.hover({ position: { x: 2, y: 8 } })
			await expect(tooltip).toBeVisible()
			const movedSource = await boundingBox(label)
			const moved = await boundingBox(tooltip)
			expect(moved.x).toBeCloseTo(Math.max(8 * scale, movedSource.x + 2 - 8 * scale), 0)
			expect(moved.y + moved.height).toBeLessThan(movedSource.y)
			await tooltip.evaluate((element) => {
				element.textContent = 'Description at pane scale.'
			})
		}
	})

	test('stays hidden while another control is being dragged', async ({ page }) => {
		const glowRow = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const qualityRow = page.locator('.tp-lblv').filter({
			has: page.getByText('Quality', { exact: true }),
		})
		const qualityLabel = qualityRow.locator('.tp-lblv_l')
		const tooltip = qualityRow.locator('[role="tooltip"]')
		const trackBounds = await glowRow.locator('.tp-sldv_t').boundingBox()
		const labelBounds = await qualityLabel.boundingBox()
		expect(trackBounds).not.toBeNull()
		expect(labelBounds).not.toBeNull()

		await page.mouse.move((trackBounds?.x ?? 0) + 12, (trackBounds?.y ?? 0) + 8)
		await page.mouse.down()
		await page.mouse.move((labelBounds?.x ?? 0) + 12, (labelBounds?.y ?? 0) + 8)
		await page.waitForTimeout(600)
		await expect(tooltip).toBeHidden()

		await page.mouse.up()
		await page.mouse.move((labelBounds?.x ?? 0) + 13, (labelBounds?.y ?? 0) + 8)
		await expect(tooltip).toBeVisible()
	})

	test('stays hidden while the pointer is locked', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const label = row.locator('.tp-lblv_l')
		const tooltip = row.locator('[role="tooltip"]')
		const labelBounds = await label.boundingBox()
		expect(labelBounds).not.toBeNull()

		await page.evaluate(() => {
			Object.defineProperty(document, 'pointerLockElement', {
				configurable: true,
				value: document.body,
			})
			document.dispatchEvent(new Event('pointerlockchange'))
		})
		await page.mouse.move((labelBounds?.x ?? 0) + 12, (labelBounds?.y ?? 0) + 8)
		await page.waitForTimeout(600)
		await expect(tooltip).toBeHidden()

		await page.evaluate(() => {
			Reflect.deleteProperty(document, 'pointerLockElement')
			document.dispatchEvent(new Event('pointerlockchange'))
		})
		await page.mouse.move((labelBounds?.x ?? 0) + 13, (labelBounds?.y ?? 0) + 8)
		await expect(tooltip).toBeVisible()
	})

	test('opens over the whole label, including empty space', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const label = row.locator('.tp-lblv_l')
		const tooltip = row.locator('[role="tooltip"]')
		const labelBounds = await boundingBox(label)
		await page.mouse.move(labelBounds.x + labelBounds.width - 4, labelBounds.y + 8)
		await expect(tooltip).toBeVisible()

		await label.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
	})

	test('does not derive vertical placement from device pixel ratio', async ({ page }) => {
		const initialDevicePixelRatio = await page.evaluate(() => window.devicePixelRatio)
		await page.addInitScript((devicePixelRatio) => {
			Object.defineProperty(globalThis, 'devicePixelRatio', {
				configurable: true,
				value: devicePixelRatio,
			})
		}, initialDevicePixelRatio * 2)
		await page.reload()
		await expect(page.locator('[role="tooltip"]')).toHaveCount(12)

		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const label = row.locator('.tp-lblv_l')
		const tooltip = row.locator('[role="tooltip"]')
		const labelBounds = await label.boundingBox()
		expect(labelBounds).not.toBeNull()
		await label.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()

		const tooltipBounds = await tooltip.boundingBox()
		expect(tooltipBounds).not.toBeNull()
		expect(tooltipBounds?.y).toBeGreaterThanOrEqual(
			(labelBounds?.y ?? 0) + (labelBounds?.height ?? 0),
		)

		await page.keyboard.press('Escape')
		await page.evaluate((initialRatio) => {
			Object.defineProperty(globalThis, 'devicePixelRatio', {
				configurable: true,
				value: initialRatio,
			})
		}, initialDevicePixelRatio)

		const qualityRow = page.locator('.tp-lblv').filter({
			has: page.getByText('Quality', { exact: true }),
		})
		const qualityLabel = qualityRow.locator('.tp-lblv_l')
		const qualityTooltip = qualityRow.locator('[role="tooltip"]')
		const qualityLabelBounds = await qualityLabel.boundingBox()
		expect(qualityLabelBounds).not.toBeNull()
		await qualityLabel.hover({ position: { x: 12, y: 8 } })
		await expect(qualityTooltip).toBeVisible()

		const qualityTooltipBounds = await qualityTooltip.boundingBox()
		expect(qualityTooltipBounds).not.toBeNull()
		expect(qualityTooltipBounds?.y).toBeGreaterThanOrEqual(
			(qualityLabelBounds?.y ?? 0) + (qualityLabelBounds?.height ?? 0),
		)
	})

	test('dismisses when the control is pressed', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('.tp-lblv_l').hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
		await tooltip.dispatchEvent('mousedown')
		await expect(tooltip).toBeVisible()
		await expect(tooltip).toHaveCSS('opacity', '1')
		await row.locator('[aria-describedby]').first().dispatchEvent('mousedown')
		await page.waitForTimeout(100)
		const fadingOpacity = Number(
			await tooltip.evaluate((element) => getComputedStyle(element).opacity),
		)
		if (await page.evaluate(() => CSS.supports('overlay', 'auto'))) {
			expect(fadingOpacity).toBeGreaterThan(0)
			expect(fadingOpacity).toBeLessThan(1)
		}

		await expect(tooltip).toBeHidden()
	})

	test('allows the fade-out duration to be configured with CSS', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.evaluate((element) => {
			element.style.setProperty('--stui-description-fade-out-duration', '50ms')
		})
		await row.locator('.tp-lblv_l').hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
		await expect(tooltip).toHaveCSS('opacity', '1')
		await row.locator('[aria-describedby]').first().dispatchEvent('mousedown')
		await page.waitForTimeout(100)
		expect(await tooltip.isVisible()).toBe(false)
	})

	test('accepts layout and timing overrides from an STUI theme', async ({ page }) => {
		await page.goto('/TestDescriptionTheme.svelte')

		const pane = page.locator('.svelte-tweakpane-ui')
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Themed', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')
		const variables = await pane.evaluate((element) => {
			const style = getComputedStyle(element)
			return {
				delay: style.getPropertyValue('--stui-description-delay').trim(),
				fadeIn: style.getPropertyValue('--stui-description-fade-in-duration').trim(),
				fadeOut: style.getPropertyValue('--stui-description-fade-out-duration').trim(),
			}
		})
		expect(variables).toEqual({ delay: '0.05s', fadeIn: '75ms', fadeOut: '60ms' })

		await row.locator('.tp-lblv_l').hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()

		const styles = await tooltip.evaluate((element) => {
			const style = getComputedStyle(element)
			return {
				maxWidth: style.maxWidth,
				padding: style.padding,
				transitionDuration: style.transitionDuration.split(',', 1)[0],
			}
		})
		expect(styles).toEqual({
			maxWidth: '120px',
			padding: '6px 8px',
			transitionDuration: '0.075s',
		})
		const lineHeight = await tooltip.evaluate((element) => {
			const style = getComputedStyle(element)
			return Number(style.lineHeight.replace('px', '')) / Number(style.fontSize.replace('px', ''))
		})
		expect(lineHeight).toBeCloseTo(1.4, 2)

		await row.locator('[aria-describedby]').first().dispatchEvent('mousedown')
		await page.waitForTimeout(100)
		expect(await tooltip.isVisible()).toBe(false)

		await page.getByRole('button', { name: 'Use CSS theme keys' }).click()
		await expect(pane).toHaveCSS('--stui-description-delay', '0.2s')
		await row.locator('.tp-lblv_l').hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
		await expect(tooltip).toHaveCSS('max-width', '160px')
		await expect(tooltip).toHaveCSS('padding', '4px')
	})

	test('stays hidden during labelled and unlabeled keyboard focus', async ({ page }) => {
		const glowRow = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Quality', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')
		const control = row.getByRole('combobox')

		await glowRow.locator('[aria-describedby]').last().focus()
		await page.keyboard.press('Tab')
		await expect(control).toBeFocused()
		await expect(tooltip).toBeHidden()

		const action = page.getByRole('button', { name: 'Action' })
		const actionRow = action.locator(
			'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " tp-lblv ")]',
		)
		const actionTooltip = actionRow.locator('[role="tooltip"]')
		await page.keyboard.press('Tab')
		await expect(action).toBeFocused()
		await expect(actionTooltip).toBeHidden()
	})

	test('remains available from the label when the control is disabled', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Settings', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('.tp-lblv_l').hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
		await expect(row.getByRole('button', { name: 'Reset' })).toBeDisabled()
	})

	test('uses the whole blade as the hover target when there is no label', async ({ page }) => {
		const action = page.getByRole('button', { name: 'Action' })
		const row = action.locator(
			'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " tp-lblv ")]',
		)
		const tooltip = row.locator('[role="tooltip"]')
		const rowBounds = await row.boundingBox()
		expect(rowBounds).not.toBeNull()

		await expect(row).not.toHaveAttribute('title')
		await action.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()

		const tooltipBounds = await tooltip.boundingBox()
		expect(tooltipBounds).not.toBeNull()
		expect(tooltipBounds?.y).toBeGreaterThanOrEqual((rowBounds?.y ?? 0) + (rowBounds?.height ?? 0))
	})

	test('anchors vertically independently of label and wide states', async ({ page }) => {
		await page.setViewportSize({ height: 1600, width: 1280 })

		const labeledWideTooltip = page.locator('[role="tooltip"]').filter({
			hasText: 'Adjusts a labeled wide slider.',
		})
		const labeledWideLabel = labeledWideTooltip.locator('..').locator('.tp-lblv_l')
		const labeledWideBounds = await labeledWideLabel.boundingBox()
		expect(labeledWideBounds).not.toBeNull()

		await labeledWideLabel.hover({ position: { x: 12, y: 8 } })
		await expect(labeledWideTooltip).toBeVisible()
		const labeledWideTooltipBounds = await labeledWideTooltip.boundingBox()
		expect(labeledWideTooltipBounds).not.toBeNull()
		expect(labeledWideTooltipBounds?.y).toBeGreaterThanOrEqual(
			(labeledWideBounds?.y ?? 0) + (labeledWideBounds?.height ?? 0),
		)
		await page.keyboard.press('Escape')
		await expect(labeledWideTooltip).toBeHidden()

		const wideTooltip = page.locator('[role="tooltip"]').filter({
			hasText: 'Adjusts an unlabeled wide slider.',
		})
		const wideRow = wideTooltip.locator('..')
		const sliderTrack = wideRow.locator('.tp-sldv_t')
		const wideRowBounds = await wideRow.boundingBox()
		expect(wideRowBounds).not.toBeNull()

		await sliderTrack.hover({ position: { x: 12, y: 8 } })
		await expect(wideTooltip).toBeVisible()
		const wideTooltipBounds = await wideTooltip.boundingBox()
		expect(wideTooltipBounds).not.toBeNull()
		expect(wideTooltipBounds?.y).toBeGreaterThanOrEqual(
			(wideRowBounds?.y ?? 0) + (wideRowBounds?.height ?? 0),
		)
		await page.keyboard.press('Escape')
		await expect(wideTooltip).toBeHidden()

		const textTooltip = page.locator('[role="tooltip"]').filter({
			hasText: 'Edits unlabeled text.',
		})
		const textRow = textTooltip.locator('..')
		const textInput = textTooltip.locator('..').locator('input')
		const textRowBounds = await textRow.boundingBox()
		expect(textRowBounds).not.toBeNull()

		await textInput.hover({ position: { x: 24, y: 8 } })
		await expect(textTooltip).toBeVisible()
		const textTooltipBounds = await textTooltip.boundingBox()
		expect(textTooltipBounds).not.toBeNull()
		expect(textTooltipBounds?.y).toBeGreaterThanOrEqual(
			(textRowBounds?.y ?? 0) + (textRowBounds?.height ?? 0),
		)
	})

	test('follows a reactively updated label', async ({ page }) => {
		await page.getByRole('button', { name: 'Update label' }).dispatchEvent('click')

		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Bloom', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')
		await expect(row.locator('.tp-lblv_l')).toHaveText('Bloom')

		await row.locator('.tp-lblv_l').hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
	})

	test('opens above its label near the bottom of the viewport', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const label = row.locator('.tp-lblv_l')
		const tooltip = row.locator('[role="tooltip"]')

		await row.evaluate((element) => {
			Object.assign(element.style, {
				bottom: '0',
				left: '100px',
				position: 'fixed',
				width: '300px',
			})
		})
		const labelBounds = await label.boundingBox()
		expect(labelBounds).not.toBeNull()

		await label.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()

		const bounds = await boundingBox(tooltip)
		expect(bounds.y + bounds.height).toBeLessThan(labelBounds?.y ?? 0)
	})

	test('flips the caret with an open tooltip after viewport resizing and scrolling', async ({
		page,
	}) => {
		const row = page.locator('.tp-lblv').filter({ has: page.getByText('Glow', { exact: true }) })
		const label = row.locator('.tp-lblv_l')
		const tooltip = row.locator('[role="tooltip"]')
		await page.evaluate(() => {
			document.body.style.minHeight = '2000px'
		})
		await row.evaluate((element) => {
			Object.assign(element.style, {
				left: '100px',
				position: 'absolute',
				top: '350px',
				width: '300px',
			})
		})
		await label.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
		const source = await boundingBox(label)
		const initialCaret = await caretStyle(tooltip)
		expect(initialCaret.bottomColor).toBe(initialCaret.background)

		await page.setViewportSize({ height: Math.ceil(source.y + source.height + 10), width: 1280 })
		await expect
			.poll(async () => {
				const caret = await caretStyle(tooltip)
				return caret.topColor
			})
			.toBe(initialCaret.background)
		const above = await boundingBox(tooltip)
		expect(above.y + above.height).toBeLessThan(source.y)

		await page.evaluate((scrollY) => window.scrollTo(0, scrollY), source.y - 4)
		await label.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
		await expect
			.poll(async () => {
				const caret = await caretStyle(tooltip)
				return caret.bottomColor
			})
			.toBe(initialCaret.background)
		const scrolledSource = await boundingBox(label)
		const below = await boundingBox(tooltip)
		expect(below.y).toBeGreaterThan(scrolledSource.y + scrolledSource.height)
	})

	test('reactively updates and removes a description', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})

		await page.getByRole('button', { name: 'Update description' }).dispatchEvent('click')
		await expect(page.getByTestId('description-state')).toHaveText('Updated description')
		await expect(row.locator('[role="tooltip"]')).toHaveText('Updated description')
		await expect(row.locator('.tp-lblv_l')).not.toHaveAttribute('title')
		await expect(
			page.locator('.tp-lblv').filter({ hasText: 'Settings' }).locator('[role="tooltip"]'),
		).toHaveText('Updated description')
		const label = row.locator('.tp-lblv_l')
		await label.evaluate((element) => {
			const htmlElement = element as HTMLElement
			htmlElement.style.setProperty('anchor-name', '--external-anchor')
		})
		await label.hover({ position: { x: 12, y: 8 } })
		await expect(row.locator('[role="tooltip"]')).toBeVisible()
		expect(
			await label.evaluate((element) =>
				(element as HTMLElement).style.getPropertyValue('anchor-name'),
			),
		).toBe('--external-anchor')

		const describedControl = row.locator('[aria-describedby]').first()
		await describedControl.evaluate((element) => {
			const ids = element.getAttribute('aria-describedby') ?? ''
			element.setAttribute('aria-describedby', `${ids} external-description`)
		})

		await page.getByRole('button', { name: 'Remove description' }).dispatchEvent('click')
		await expect(row).not.toHaveAttribute('data-stui-description')
		await expect(row.locator('[role="tooltip"]')).toHaveCount(0)
		await expect(label).toHaveText('Glow')
		expect(await label.evaluate((element) => getComputedStyle(element, '::after').content)).toBe(
			'none',
		)
		await expect(describedControl).toHaveAttribute('aria-describedby', 'external-description')
		expect(
			await label.evaluate((element) =>
				(element as HTMLElement).style.getPropertyValue('anchor-name'),
			),
		).toBe('--external-anchor')
	})

	test('inherits the active Tweakpane theme', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('.tp-lblv_l').hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()

		const styles = await tooltip.evaluate((element) => {
			const reference = element.closest('.tp-rotv')?.querySelector<HTMLElement>('.tp-ttv')
			if (reference === null || reference === undefined) {
				throw new Error('Tweakpane slider tooltip not found')
			}

			const descriptionStyle = getComputedStyle(element)
			const referenceStyle = getComputedStyle(reference)
			const properties = [
				'backgroundColor',
				'borderTopColor',
				'borderTopLeftRadius',
				'color',
				'fontFamily',
				'fontSize',
				'fontWeight',
			] as const

			return properties.map((property) => ({
				description: descriptionStyle[property],
				property,
				reference: referenceStyle[property],
			}))
		})

		for (const style of styles) {
			expect(style.description, style.property).toBe(style.reference)
		}

		const shadow = await tooltip.evaluate((element) => {
			const pane = element.closest<HTMLElement>('.tp-rotv')
			if (pane === null) {
				throw new Error('Tweakpane root not found')
			}

			return {
				description: getComputedStyle(element).boxShadow,
				pane: getComputedStyle(pane).boxShadow,
			}
		})
		expect(shadow.description).toBe(shadow.pane)

		const initialBackground = await tooltip.evaluate(
			(element) => getComputedStyle(element).backgroundColor,
		)
		const themeRow = page.locator('.tp-lblv').filter({
			has: page.getByText('Theme', { exact: true }),
		})
		const themeSelect = themeRow.getByRole('combobox')
		const currentTheme = await themeSelect.inputValue()
		await themeSelect.selectOption(currentTheme === 'light' ? 'iceberg' : 'light')
		await expect
			.poll(async () => tooltip.evaluate((element) => getComputedStyle(element).backgroundColor))
			.not.toBe(initialBackground)

		const updatedColors = await tooltip.evaluate((element) => {
			const reference = element.closest('.tp-rotv')?.querySelector<HTMLElement>('.tp-ttv')
			if (reference === null || reference === undefined) {
				throw new Error('Tweakpane slider tooltip not found')
			}

			return {
				description: getComputedStyle(element).backgroundColor,
				reference: getComputedStyle(reference).backgroundColor,
			}
		})
		expect(updatedColors.description).toBe(updatedColors.reference)
	})
	test('keeps Escape dismissal until the pointer leaves and re-enters', async ({ page }) => {
		const label = page.getByText('Glow', { exact: true })
		const tooltip = label.locator('..').locator('[role="tooltip"]')
		await label.hover()
		await expect(tooltip).toBeVisible()
		await page.keyboard.press('Escape')
		await expect(tooltip).toBeHidden()
		const bounds = await boundingBox(label)
		await page.mouse.move(bounds.x + 4, bounds.y + bounds.height / 2)
		await page.waitForTimeout(650)
		await expect(tooltip).toBeHidden()
		await page.mouse.move(900, 600)
		await label.hover()
		await expect(tooltip).toBeVisible()
	})

	test('does not open or dismiss another hint during the hover delay', async ({ page }) => {
		await page.evaluate(() => {
			const hint = document.createElement('div')
			hint.id = 'existing-hint'
			hint.popover = 'hint'
			hint.textContent = 'Existing hint'
			document.body.append(hint)
			hint.showPopover()
		})
		const existing = page.locator('#existing-hint')
		const label = page.getByText('Glow', { exact: true })
		const tooltip = label.locator('..').locator('[role="tooltip"]')
		await label.hover()
		await page.waitForTimeout(200)
		await expect(existing).toBeVisible()
		expect(await tooltip.evaluate((element) => element.matches(':popover-open'))).toBe(false)
		await page.mouse.move(900, 600)
		await page.waitForTimeout(600)
		await expect(existing).toBeVisible()
		await expect(tooltip).toBeHidden()
	})

	test('keeps manual hints dismissible without closing unrelated auto popovers', async ({
		page,
	}) => {
		// Exercise the fallback even in browsers with native hint support.
		await page.addInitScript(() => {
			const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'popover')!
			Object.defineProperty(HTMLElement.prototype, 'popover', {
				...descriptor,
				get: () => 'manual',
			})
		})
		await page.reload()
		const label = page.getByText('Glow', { exact: true })
		const tooltip = label.locator('..').locator('[role="tooltip"]')
		await expect(tooltip).toHaveAttribute('popover', 'manual')
		await page.evaluate(() => {
			const popover = document.createElement('div')
			popover.id = 'unrelated-popover'
			popover.popover = 'auto'
			popover.textContent = 'Another popover'
			document.body.append(popover)
			popover.showPopover()
		})
		await label.hover()
		await expect(tooltip).toBeVisible()
		await expect(page.locator('#unrelated-popover')).toBeVisible()
		await page.keyboard.press('Escape')
		await expect(tooltip).toBeHidden()
		await expect(page.locator('#unrelated-popover')).toBeVisible()
		await page.mouse.move(900, 600)
		await label.hover()
		await expect(tooltip).toBeVisible()
		await page.mouse.click(900, 600)
		await expect(tooltip).toBeHidden()
	})

	test('keeps the hover bridge with reduced motion and a disabled control', async ({ page }) => {
		await page.emulateMedia({ reducedMotion: 'reduce' })
		const label = page.getByText('Settings', { exact: true })
		const tooltip = label.locator('..').locator('[role="tooltip"]')
		await label.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
		const source = await boundingBox(label)
		const target = await boundingBox(tooltip)
		for (let y = source.y + source.height / 2; y <= target.y + 4; y += 2) {
			await page.mouse.move(source.x + 12, y)
			await page.waitForTimeout(40)
		}

		await page.waitForTimeout(300)
		await expect(tooltip).toBeVisible()
		await page.mouse.move(900, 600)
		await expect(tooltip).toBeHidden()
	})

	test('resolves CSS time expressions for the opening delay', async ({ page }) => {
		const label = page.getByText('Glow', { exact: true })
		const row = label.locator('..')
		const tooltip = row.locator('[role="tooltip"]')
		await row.evaluate((element) => {
			element.style.setProperty('--stui-description-delay', 'calc(0.25s + 350ms)')
		})
		await label.hover()
		await page.waitForTimeout(300)
		expect(await tooltip.evaluate((element) => element.matches(':popover-open'))).toBe(false)
		await expect(tooltip).toBeVisible()
	})

	test('keeps scaled tooltips above bottom-edge labels and inside a narrow viewport', async ({
		page,
	}) => {
		await page.goto('/TestDescriptionScale.svelte')
		const label = page.getByText('Scaled', { exact: true })
		const tooltip = label.locator('..').locator('[role="tooltip"]')
		await label.waitFor()
		await page.locator('.svelte-tweakpane-ui').evaluate((element) => {
			Object.assign(element.parentElement!.style, {
				bottom: '0',
				left: '8px',
				position: 'fixed',
				width: '600px',
			})
		})
		await label.hover()
		await expect(tooltip).toBeVisible()
		const source = await boundingBox(label)
		const target = await boundingBox(tooltip)
		expect(target.y + target.height).toBeLessThan(source.y)
		await page.setViewportSize({ height: 720, width: 320 })
		await expect(tooltip).toBeVisible()
		const resized = await boundingBox(tooltip)
		expect(resized.x).toBeGreaterThanOrEqual(0)
		expect(resized.x + resized.width).toBeLessThanOrEqual(320)
	})

	test('updates and disposes descriptions across standalone control replacements', async ({
		page,
	}) => {
		const errors: Error[] = []
		page.on('pageerror', (error) => {
			errors.push(error)
		})
		await page.goto('/TestDescriptionLifecycle.svelte')
		const label = page.getByText('Lifecycle', { exact: true })
		const tooltip = page
			.locator('[role="tooltip"]')
			.filter({ hasText: 'A standalone description.' })
		await expect(
			page.getByRole('button', { exact: true, name: 'Action' }),
		).toHaveAccessibleDescription('A standalone action.')
		await label.hover()
		await page.getByRole('button', { name: 'Recreate control' }).dispatchEvent('click')
		await expect(page.locator('[role="tooltip"]')).toHaveCount(2)
		await page.mouse.move(900, 600)
		await label.hover()
		await expect(tooltip).toBeVisible()
		await page.getByRole('button', { name: 'Toggle label' }).click()
		await page.locator('input').hover()
		await expect(tooltip).toBeVisible()
		await page.getByRole('button', { name: 'Toggle label' }).click()
		await label.hover()
		await page.getByRole('button', { name: 'Toggle controls' }).dispatchEvent('click')
		await page.waitForTimeout(700)
		await expect(page.locator('[role="tooltip"]')).toHaveCount(0)
		await page.getByRole('button', { name: 'Toggle controls' }).click()
		await label.hover()
		await expect(tooltip).toBeVisible()
		expect(errors).toEqual([])
	})

	test('keeps pane width stable while scaling and clamps scaled draggable panes', async ({
		page,
	}) => {
		await page.goto('/TestDescriptionScale.svelte')
		const pane = page.locator('.svelte-tweakpane-ui')
		const scaled = await boundingBox(pane)
		await page.getByRole('button', { name: 'Toggle scale' }).click()
		const unscaled = await boundingBox(pane)
		expect(unscaled.width).toBeCloseTo(scaled.width, 0)
		expect(scaled.height).toBeCloseTo(unscaled.height * 2, 0)
		await page.getByRole('button', { name: 'Toggle scale' }).click()
		await page.getByRole('button', { name: 'Toggle draggable' }).click()
		const title = pane.locator('.tp-rotv_t')
		const origin = await boundingBox(title)
		await page.mouse.move(origin.x + 30, origin.y + origin.height / 2)
		await page.mouse.down()
		await page.mouse.move(500, 715, { steps: 5 })
		await page.mouse.up()
		await page.setViewportSize({ height: 480, width: 800 })
		await expect
			.poll(async () => {
				const bounds = await boundingBox(pane)
				return bounds.y + bounds.height
			})
			.toBeLessThanOrEqual(480)
		const finalBounds = await boundingBox(pane)
		expect(finalBounds.y + finalBounds.height).toBeGreaterThan(460)
	})
})
