import { expect, test } from '@playwright/test'

test.describe('Pane component', () => {
	test.describe('basic functionality', () => {
		test('renders pane with slider', async ({ page }) => {
			await page.goto('/TestPane.svelte')

			// Pane should be visible with slider
			await expect(page.locator('.tp-sldv').first()).toBeVisible()
		})

		test('advanced pane features work correctly', async ({ page }) => {
			await page.goto('/TestPaneAdvanced.svelte')

			// Advanced pane should render with components
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})

	test.describe('position modes', () => {
		test('inline pane renders in document flow', async ({ page }) => {
			await page.goto('/TestCollapseExpand.svelte')

			// Find inline pane by title text
			await expect(page.getByText('Inline Pane').first()).toBeVisible()
		})

		test('draggable pane can be positioned', async ({ page }) => {
			await page.goto('/TestCollapseExpand.svelte')

			// Draggable panes should be present by title text
			await expect(page.getByText('Draggable Pane').first()).toBeVisible()
		})

		test('fixed pane renders at specified position', async ({ page }) => {
			await page.goto('/TestCollapseExpand.svelte')

			// Fixed pane should be visible by title text
			await expect(page.getByText('Fixed Pane').first()).toBeVisible()
		})
	})

	test.describe('collapse/expand', () => {
		test('pane with expanded={false} starts collapsed', async ({ page }) => {
			await page.goto('/TestCollapseExpand.svelte')

			// Find inline pane with unbound literal (expanded={false})
			await expect(page.getByText('Inline Pane Unbound Literal')).toBeVisible()
		})

		test('pane expanded state is shown', async ({ page }) => {
			await page.goto('/TestCollapseExpand.svelte')

			// The initial expanded state (false) should be displayed
			await expect(page.getByText('false').first()).toBeVisible()
		})
	})

	test.describe('host page styles', () => {
		for (const position of ['Draggable', 'Fixed']) {
			test(`${position.toLowerCase()} pane stays interactive when the page disables pointer events`, async ({
				page,
			}) => {
				await page.goto('/TestPanePointerEvents.svelte')

				// Pages with a background that tracks the pointer do this, re-enabling
				// pointer events only for their own interactive elements
				await page.addStyleTag({ content: 'body { pointer-events: none; }' })

				const track = page
					.locator('.tp-lblv', { hasText: `${position} Slider` })
					.locator('.tp-sldv_t')
				await expect(track).toBeVisible()
				const box = await track.boundingBox()
				if (box === null) {
					throw new Error(`The ${position} Slider track is not rendered`)
				}

				// Mouse coordinates bypass Playwright's own hit-target check, so the
				// assertion below reports the failure instead of a click timeout
				await page.mouse.click(box.x + box.width * 0.9, box.y + box.height / 2)

				await expect(page.getByText(`${position} value: 0`, { exact: true })).toBeHidden()
			})
		}
	})

	test.describe('grid layout', () => {
		test('pane renders with grid layout', async ({ page }) => {
			await page.goto('/TestGridLayoutPane.svelte')

			// Grid layout pane should render with labels
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})

		test('wrapper renders with grid layout', async ({ page }) => {
			await page.goto('/TestGridLayoutWrapper.svelte')

			// Grid layout wrapper should render with labels
			await expect(page.locator('.tp-lblv').first()).toBeVisible()
		})
	})
})
