import { expect, test } from '@playwright/test'

// cspell:words describedby

const WHITESPACE_PATTERN = /\s+/v

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
		await expect(tooltips.first()).toHaveAttribute('popover', 'hint')
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
		for (const control of controls) {
			const describedBy = await control.getAttribute('aria-describedby')
			expect(describedBy?.split(WHITESPACE_PATTERN)).toContain(descriptionId)
		}
	})

	test('matches the pane scale after entering the top layer', async ({ page }) => {
		const pane = page.locator('.svelte-tweakpane-ui')
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('.tp-lblv_l').hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()

		const paneRenderScale = await pane.evaluate(
			(element) => element.getBoundingClientRect().width / (element as HTMLElement).offsetWidth,
		)
		const tooltipRenderScale = await tooltip.evaluate(
			(element) => element.getBoundingClientRect().width / (element as HTMLElement).offsetWidth,
		)
		expect(paneRenderScale).toBeCloseTo(2, 1)
		expect(tooltipRenderScale).toBeCloseTo(paneRenderScale, 1)
	})

	test('supports an affordance after truncated label text', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Labeled Wide Slider', { exact: true }),
		})
		const label = row.locator('.tp-lblv_l')
		const tooltip = row.locator('[role="tooltip"]')
		const checkbox = page
			.locator('.tp-lblv')
			.filter({ hasText: 'Show description icons' })
			.locator('.tp-ckbv_w')
		const affordanceContent = async () =>
			label.evaluate((element) => getComputedStyle(element, '::after').content)

		expect(await affordanceContent()).toBe('none')
		await checkbox.click()
		expect(await affordanceContent()).toBe('"🛈"')

		const labelBounds = await label.boundingBox()
		expect(labelBounds).not.toBeNull()
		await label.hover({ position: { x: (labelBounds?.width ?? 0) - 8, y: 8 } })
		await expect(tooltip).toBeVisible()

		await label.evaluate((element) => {
			element.style.flex = '0 0 48px'
		})
		await expect
			.poll(async () => label.evaluate((element) => element.scrollWidth > element.clientWidth))
			.toBe(true)
		expect(await affordanceContent()).toBe('"🛈"')
		const layout = await label.evaluate((element) => {
			const bounds = element.getBoundingClientRect()
			const scale = bounds.width / (element as HTMLElement).offsetWidth
			const style = getComputedStyle(element)
			const affordanceStyle = getComputedStyle(element, '::after')
			const text = element.firstChild
			if (!(text instanceof Text)) {
				throw new TypeError('Label text node not found')
			}

			const range = document.createRange()
			range.selectNodeContents(text)
			const contentRight =
				bounds.right -
				(Number(style.borderRightWidth.slice(0, -2)) + Number(style.paddingRight.slice(0, -2))) *
					scale
			const affordanceRight = bounds.right - Number(affordanceStyle.right.slice(0, -2)) * scale
			const affordanceLeft = affordanceRight - Number(affordanceStyle.width.slice(0, -2)) * scale

			return {
				affordanceLeft,
				affordanceRight,
				contentRight,
				labelRight: bounds.right,
				textRight: range.getBoundingClientRect().right,
			}
		})
		expect(layout.textRight).toBeGreaterThan(layout.contentRight)
		expect(layout.affordanceLeft).toBeCloseTo(layout.contentRight, 0)
		expect(layout.affordanceRight).toBeLessThanOrEqual(layout.labelRight)
		await checkbox.hover()
		await expect(tooltip).toBeHidden()

		const truncatedBounds = await label.boundingBox()
		expect(truncatedBounds).not.toBeNull()
		await label.hover({ position: { x: (truncatedBounds?.width ?? 0) - 8, y: 8 } })
		await expect(tooltip).toBeVisible()

		await checkbox.click()
		expect(await affordanceContent()).toBe('none')
	})

	test('shows beside the pointer after a hover delay and remains open while hovered', async ({
		page,
	}) => {
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
		await page.waitForTimeout(400)
		await expect(tooltip).toBeHidden()
		await expect(tooltip).toBeVisible()

		const tooltipBounds = await tooltip.boundingBox()
		expect(tooltipBounds).not.toBeNull()
		const pointerX = (labelBounds?.x ?? 0) + 12
		const caret = await tooltip.evaluate((element) => {
			const style = getComputedStyle(element, '::before')
			return {
				borderBottomColor: style.borderBottomColor,
				left: Number(style.left.replace('px', '')),
				scale: element.getBoundingClientRect().width / (element as HTMLElement).offsetWidth,
			}
		})
		expect((tooltipBounds?.x ?? 0) + caret.left * caret.scale).toBeCloseTo(pointerX, 0)
		expect(caret.borderBottomColor).toBe(
			await tooltip.evaluate((element) => getComputedStyle(element).backgroundColor),
		)
		expect(tooltipBounds?.y).toBeCloseTo((labelBounds?.y ?? 0) + 8 + 16, 0)
		await expect(tooltip).toHaveCSS('overflow', 'visible')
		await expect(tooltip).toHaveCSS('text-align', 'left')
		expect(
			await tooltip.evaluate(
				(element) => getComputedStyle(element).transitionDuration.split(',', 1)[0],
			),
		).toBe('0s')

		await tooltip.hover()
		await page.waitForTimeout(150)
		await expect(tooltip).toBeVisible()
	})

	test('opens only over rendered label text', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const label = row.locator('.tp-lblv_l')
		const tooltip = row.locator('[role="tooltip"]')
		const labelBounds = await label.boundingBox()
		expect(labelBounds).not.toBeNull()

		const position = {
			x: (labelBounds?.width ?? 0) - 4,
			y: 8,
		}
		await label.hover({ position })
		await page.waitForTimeout(600)
		await expect(tooltip).toBeHidden()

		await label.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
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
		await page.waitForTimeout(250)
		const fadingOpacity = Number(
			await tooltip.evaluate((element) => getComputedStyle(element).opacity),
		)
		expect(fadingOpacity).toBeGreaterThan(0)
		expect(fadingOpacity).toBeLessThan(1)
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
		expect(variables).toEqual({ delay: '50ms', fadeIn: '75ms', fadeOut: '60ms' })

		await row.locator('.tp-lblv_l').hover({ position: { x: 12, y: 8 } })
		await page.waitForTimeout(25)
		await expect(tooltip).toBeHidden()
		await expect(tooltip).toBeVisible()

		const styles = await tooltip.evaluate((element) => {
			const style = getComputedStyle(element)
			return {
				maxWidth: style.maxWidth,
				transitionDuration: style.transitionDuration.split(',', 1)[0],
			}
		})
		expect(styles).toEqual({
			maxWidth: '120px',
			transitionDuration: '0.075s',
		})

		await row.locator('[aria-describedby]').first().dispatchEvent('mousedown')
		await page.waitForTimeout(100)
		expect(await tooltip.isVisible()).toBe(false)
	})

	test('shows on control focus and dismisses with Escape', async ({ page }) => {
		const row = page.locator('.tp-lblv').filter({ hasText: 'Quality' })
		const tooltip = row.locator('[role="tooltip"]')

		await row.getByRole('combobox').focus()
		await expect(tooltip).toBeVisible()
		await page.keyboard.press('Escape')
		await expect(tooltip).toBeHidden()
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
		const actionBounds = await action.boundingBox()
		expect(actionBounds).not.toBeNull()

		await expect(row).not.toHaveAttribute('title')
		await action.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()

		const tooltipBounds = await tooltip.boundingBox()
		expect(tooltipBounds).not.toBeNull()
		expect(tooltipBounds?.y).toBeCloseTo((actionBounds?.y ?? 0) + 8 + 24, 0)
	})

	test('adapts the gap to the cursor independently of label and wide states', async ({ page }) => {
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
		expect(labeledWideTooltipBounds?.y).toBeCloseTo((labeledWideBounds?.y ?? 0) + 8 + 16, 0)

		const wideTooltip = page.locator('[role="tooltip"]').filter({
			hasText: 'Adjusts an unlabeled wide slider.',
		})
		const wideRow = wideTooltip.locator('..')
		const sliderTrack = wideRow.locator('.tp-sldv_t')
		const sliderBounds = await sliderTrack.boundingBox()
		expect(sliderBounds).not.toBeNull()
		await expect(sliderTrack).toHaveCSS('cursor', 'pointer')

		await sliderTrack.hover({ position: { x: 12, y: 8 } })
		await expect(wideTooltip).toBeVisible()
		const wideTooltipBounds = await wideTooltip.boundingBox()
		expect(wideTooltipBounds).not.toBeNull()
		expect(wideTooltipBounds?.y).toBeCloseTo((sliderBounds?.y ?? 0) + 8 + 24, 0)

		const textTooltip = page.locator('[role="tooltip"]').filter({
			hasText: 'Edits unlabeled text.',
		})
		const textInput = textTooltip.locator('..').locator('input')
		const textBounds = await textInput.boundingBox()
		expect(textBounds).not.toBeNull()
		await expect(textInput).not.toHaveCSS('cursor', 'pointer')

		await textInput.hover({ position: { x: 24, y: 8 } })
		await expect(textTooltip).toBeVisible()
		const textTooltipBounds = await textTooltip.boundingBox()
		expect(textTooltipBounds).not.toBeNull()
		expect(textTooltipBounds?.y).toBeCloseTo((textBounds?.y ?? 0) + 8 + 16, 0)
	})

	test('follows a reactively updated label', async ({ page }) => {
		await page.getByRole('button', { name: 'Update label' }).dispatchEvent('click')

		const row = page.locator('.tp-lblv').filter({
			has: page.getByText('Bloom', { exact: true }),
		})
		const tooltip = row.locator('[role="tooltip"]')

		await row.locator('.tp-lblv_l').hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
	})

	test('flips the caret when the tooltip opens above its origin', async ({ page }) => {
		await page.locator('.svelte-tweakpane-ui').evaluate((element) => {
			element.style.removeProperty('transform')
			element.style.removeProperty('transform-origin')
			element.style.removeProperty('width')
			element.style.setProperty('--stui-pane-scale', '1')
		})
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
		const origin = {
			x: (labelBounds?.x ?? 0) + 12,
			y: (labelBounds?.y ?? 0) + 8,
		}
		await label.hover({ position: { x: 12, y: 8 } })
		await expect(tooltip).toBeVisible()
		await expect(tooltip).toHaveAttribute('data-stui-placement', 'above')

		const placement = await tooltip.evaluate((element) => {
			const caretStyle = getComputedStyle(element, '::before')
			return {
				background: getComputedStyle(element).backgroundColor,
				borderTopColor: caretStyle.borderTopColor,
				bottom: element.getBoundingClientRect().bottom,
			}
		})
		expect(placement.borderTopColor).toBe(placement.background)
		expect(placement.bottom).toBeLessThan(origin.y)
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

		const describedControl = row.locator('[aria-describedby]').first()
		await describedControl.evaluate((element) => {
			const ids = element.getAttribute('aria-describedby') ?? ''
			element.setAttribute('aria-describedby', `${ids} external-description`)
		})

		await page.getByRole('button', { name: 'Remove description' }).dispatchEvent('click')
		await expect(row).not.toHaveAttribute('data-stui-description')
		await expect(row.locator('[role="tooltip"]')).toHaveCount(0)
		await expect(describedControl).toHaveAttribute('aria-describedby', 'external-description')
	})

	test('keeps the accessible description when the Popover API is unavailable', async ({ page }) => {
		await page.addInitScript(() => {
			Object.defineProperties(HTMLElement.prototype, {
				hidePopover: {
					configurable: true,
					value: undefined,
				},
				showPopover: {
					configurable: true,
					value: undefined,
				},
			})
		})
		await page.reload()

		const glowRow = page.locator('.tp-lblv').filter({
			has: page.getByText('Glow', { exact: true }),
		})
		const glowLabel = glowRow.locator('.tp-lblv_l')
		const tooltip = glowRow.locator('[role="tooltip"]')
		const descriptionId = await tooltip.getAttribute('id')
		const describedControl = glowRow.locator('[aria-describedby]').first()

		await expect(glowLabel).not.toHaveAttribute('title')
		await expect(tooltip).toBeHidden()
		await expect(tooltip).not.toHaveAttribute('popover')

		if (descriptionId === null) {
			throw new Error('Description is missing an ID')
		}

		await expect(describedControl).toHaveAttribute('aria-describedby', descriptionId)

		await page.getByRole('button', { name: 'Update description' }).dispatchEvent('click')
		await expect(glowLabel).not.toHaveAttribute('title')
		await expect(tooltip).toHaveText('Updated description')
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
				'boxShadow',
				'color',
				'fontFamily',
				'fontSize',
				'fontWeight',
				'lineHeight',
				'paddingBottom',
				'paddingLeft',
				'paddingRight',
				'paddingTop',
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

		const initialBackground = await tooltip.evaluate(
			(element) => getComputedStyle(element).backgroundColor,
		)
		const themeRow = page.locator('.tp-lblv').filter({
			has: page.getByText('Theme', { exact: true }),
		})
		await themeRow.getByRole('combobox').selectOption('light')
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
})
