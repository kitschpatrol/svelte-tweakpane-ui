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
