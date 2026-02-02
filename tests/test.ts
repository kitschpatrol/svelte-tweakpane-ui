import { expect, test } from '@playwright/test'

test('on chang events are fired when the user interacts', async ({ page }) => {
	await page.goto('/TestBinding.svelte')

	await page.getByRole('textbox').first().press('ArrowUp')

	expect(
		await page
			.locator('pre')
			.filter({ hasText: 'Binding 1 Internal:' })
			.locator('span')
			.innerHTML(),
	).toBe('1')
	expect(
		await page
			.locator('pre')
			.filter({ hasText: 'Binding 1 External:' })
			.locator('span')
			.innerHTML(),
	).toBe('0')
	expect(
		await page
			.locator('pre')
			.filter({ hasText: 'Binding 2 Internal:' })
			.locator('span')
			.innerHTML(),
	).toBe('0')
	expect(
		await page
			.locator('pre')
			.filter({ hasText: 'Binding 2 External:' })
			.locator('span')
			.innerHTML(),
	).toBe('1')

	for (let i = 0; i < 10; i++) {
		await page.getByRole('textbox').last().press('ArrowDown')
	}

	expect(
		await page
			.locator('pre')
			.filter({ hasText: 'Binding 1 Internal:' })
			.locator('span')
			.innerHTML(),
	).toBe('1')
	expect(
		await page
			.locator('pre')
			.filter({ hasText: 'Binding 1 External:' })
			.locator('span')
			.innerHTML(),
	).toBe('10')
	expect(
		await page
			.locator('pre')
			.filter({ hasText: 'Binding 2 Internal:' })
			.locator('span')
			.innerHTML(),
	).toBe('10')
	expect(
		await page
			.locator('pre')
			.filter({ hasText: 'Binding 2 External:' })
			.locator('span')
			.innerHTML(),
	).toBe('1')

	// FirstBox.press('up');
})

test('repro issue 31', async ({ page }) => {
	await page.goto('/TestTabIndexBinding.svelte')

	// Initial state
	/// Mode 0, Tab 1, Tab B active
	await expect(page.getByText('Mode: 0')).toBeVisible()
	await expect(page.getByText('TabIndex: 1')).toBeVisible()
	await expect(page.getByRole('button', { exact: true, name: 'B' }).locator('..')).toHaveClass(
		'tp-tbiv tp-tbiv-sel',
	)

	// Select tab A
	await page.getByRole('button', { exact: true, name: 'A' }).click()
	await expect(page.getByText('TabIndex: 0')).toBeVisible()
	await expect(page.getByRole('button', { exact: true, name: 'A' }).locator('..')).toHaveClass(
		'tp-tbiv tp-tbiv-sel',
	)

	// Back to tab B
	await page.getByRole('button', { exact: true, name: 'B' }).click()
	await expect(page.getByText('TabIndex: 1')).toBeVisible()
	await expect(page.getByRole('button', { exact: true, name: 'B' }).locator('..')).toHaveClass(
		'tp-tbiv tp-tbiv-sel',
	)

	// Cycle mode
	await page.getByRole('button', { name: 'Cycle Mode' }).first().click()

	/// Mode 1, Tab 1, Tab B active
	await expect(page.getByText('Mode: 1')).toBeVisible()
	await expect(page.getByText('TabIndex: 1')).toBeVisible()
	await expect(page.getByRole('button', { exact: true, name: 'B' }).locator('..')).toHaveClass(
		'tp-tbiv tp-tbiv-sel',
	)

	// Select tab A
	await page.getByRole('button', { exact: true, name: 'A' }).click()
	await expect(page.getByText('TabIndex: 0')).toBeVisible()
	await expect(page.getByRole('button', { exact: true, name: 'A' }).locator('..')).toHaveClass(
		'tp-tbiv tp-tbiv-sel',
	)

	// Back to tab B
	await page.getByRole('button', { exact: true, name: 'B' }).click()
	await expect(page.getByText('TabIndex: 1')).toBeVisible()
	await expect(page.getByRole('button', { exact: true, name: 'B' }).locator('..')).toHaveClass(
		'tp-tbiv tp-tbiv-sel',
	)

	// Cycle mode, preserving tab index
	await page.getByRole('button', { name: 'Cycle Mode' }).first().click()
	await expect(page.getByText('Mode: 2')).toBeVisible()
	await expect(page.getByText('TabIndex: 1')).toBeVisible()
})
