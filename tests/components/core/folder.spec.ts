import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const expandedClass = /tp-fldv-expanded/v

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

	test.describe('alt-click exclusive expansion', () => {
		// Title bar button of the folder with the given title
		const titleBar = (page: Page, title: string) => page.locator('.tp-fldv_b', { hasText: title })
		// Root element of the folder with the given title (expanded state is
		// reflected in its tp-fldv-expanded class)
		const folder = (page: Page, title: string) => page.locator('.tp-fldv', { hasText: title })
		// Renders the expanded bindings as 'A B C Nested Locked Disabled'
		const state = (page: Page) => page.locator('#state')

		test.beforeEach(async ({ page }) => {
			await page.goto('/TestFolderExclusiveExpansion.svelte')
			await expect(state(page)).toHaveText('true true true true true true')
		})

		test('plain click collapses only the clicked folder', async ({ page }) => {
			await titleBar(page, 'Folder A').click()

			await expect(state(page)).toHaveText('false true true true true true')
			await expect(folder(page, 'Folder B')).toHaveClass(expandedClass)
			await expect(folder(page, 'Folder C')).toHaveClass(expandedClass)
		})

		test('alt-click on an open folder collapses siblings and keeps it open', async ({ page }) => {
			await titleBar(page, 'Folder A').click({ modifiers: ['Alt'] })

			// A stays open, B and C collapse, nested and non-user-expandable
			// folders are untouched
			await expect(state(page)).toHaveText('true false false true true true')
			await expect(folder(page, 'Folder A')).toHaveClass(expandedClass)
			await expect(folder(page, 'Folder B')).not.toHaveClass(expandedClass)
			await expect(folder(page, 'Folder C')).not.toHaveClass(expandedClass)
			await expect(folder(page, 'Locked')).toHaveClass(expandedClass)
			await expect(folder(page, 'Disabled')).toHaveClass(expandedClass)
		})

		test('alt-click on a closed folder opens it and collapses siblings', async ({ page }) => {
			await titleBar(page, 'Folder A').click()
			await expect(state(page)).toHaveText('false true true true true true')

			await titleBar(page, 'Folder A').click({ modifiers: ['Alt'] })

			await expect(state(page)).toHaveText('true false false true true true')
			await expect(folder(page, 'Folder A')).toHaveClass(expandedClass)
		})

		test('alt-click on a non-user-expandable folder does nothing', async ({ page }) => {
			await titleBar(page, 'Locked').click({ modifiers: ['Alt'] })

			await expect(state(page)).toHaveText('true true true true true true')
		})
	})
})
