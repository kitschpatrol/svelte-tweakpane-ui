import type { Browser, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { readdirSync } from 'node:fs'

// Every documentation example, plus fixtures covering control variants and a
// theme that changes every size
const examples = [
	...readdirSync(new URL('../../../src/examples/components/', import.meta.url))
		.filter((name) => name.endsWith('.svelte'))
		.toSorted(),
	'TestCls.svelte',
	'TestClsTheme.svelte',
]

const viewportWidths = [1280, 400]

type Section = [name: string, height: number]

/**
 * Returns the height of each section of the page, where a section runs from one
 * `<h1>` to the next, so that a change in height can be attributed to the
 * controls that caused it. A page without headings is a single section.
 */
async function getSections(page: Page): Promise<Section[]> {
	return page.evaluate(() => {
		const starts: Array<[name: string, top: number]> = [
			['(start of page)', document.body.getBoundingClientRect().top],
			...Array.from(document.querySelectorAll('h1'), (heading): [string, number] => [
				heading.textContent,
				heading.getBoundingClientRect().top,
			]),
		]
		const end = document.body.getBoundingClientRect().bottom

		return starts.map(([name, top], index): [string, number] => [
			name,
			(starts[index + 1]?.[1] ?? end) - top,
		])
	})
}

async function openPage(
	browser: Browser,
	url: string,
	width: number,
	javaScriptEnabled: boolean,
): Promise<Page> {
	const context = await browser.newContext({
		javaScriptEnabled,
		viewport: { height: 900, width },
	})
	const page = await context.newPage()
	await page.goto(url)
	return page
}

test.describe('prerendered layout', () => {
	test('placeholder styles cost nothing on a page without placeholders', async ({ page }) => {
		// The styles stay on the page after hydration, so a selector the browser
		// has to re-check on unrelated changes slows down the whole page for good
		await page.goto('/ButtonExample.svelte')
		await page.locator('.tp-rotv').first().waitFor({ state: 'attached' })
		const styles = await page.evaluate(() =>
			Array.from(
				document.querySelectorAll('style[data-vite-dev-id]'),
				(style) => style.textContent,
			).join('\n'),
		)
		expect(styles).toContain('.cls-pad-blade')

		async function timeClassChanges(css: string): Promise<number> {
			await page.setContent(`<style>${css}</style><div id="rows"></div>`)
			return page.evaluate(() => {
				const rows = document.querySelector('#rows')!
				for (let index = 0; index < 5000; index++) {
					const row = document.createElement('div')
					row.innerHTML = '<span>a</span><span>b</span><span>c</span>'
					rows.append(row)
				}

				function toggleClasses(): number {
					const start = performance.now()
					for (let index = 0; index < 400; index++) {
						rows.children[(index * 12) % 5000].classList.toggle('on')
						// Reading layout forces the browser to apply each change on its own
						rows.getBoundingClientRect()
					}

					return performance.now() - start
				}

				toggleClasses()
				return Math.min(toggleClasses(), toggleClasses(), toggleClasses())
			})
		}

		const baseline = await timeClassChanges('')
		const withStyles = await timeClassChanges(styles)

		// The costly selectors found so far were between 7 and 100 times slower
		expect(withStyles).toBeLessThan(Math.max(baseline * 3, 5))
	})

	test('a blade whose options are not yet defined renders on the server', async ({ request }) => {
		const response = await request.get('/TestBladeWithoutOptions.svelte')
		expect(response.status()).toBe(200)
	})

	test('children of panes that are not prerendered do not prerender panes of their own', async ({
		request,
	}) => {
		const response = await request.get('/TestClsHiddenPanes.svelte')
		const html = await response.text()
		// The page's inlined styles name every placeholder class, so only look at the markup
		const body = html.slice(html.indexOf('<body'))
		expect(body).toContain('cls-pad-blade')
		expect(body).not.toContain('cls-pad-root')
	})

	for (const example of examples) {
		for (const width of viewportWidths) {
			test(`${example} keeps its prerendered layout after hydration at ${width}px wide`, async ({
				baseURL,
				browser,
			}) => {
				const url = `${baseURL}/${example}`

				const hydratedPage = await openPage(browser, url, width, true)
				await hydratedPage.locator('.tp-rotv').first().waitFor({ state: 'attached' })

				// With scripts disabled, the page stays exactly as the server rendered it
				const prerenderedPage = await openPage(browser, url, width, false)

				// The dev server embeds the styles of every module it has loaded so far in
				// the pages it renders, including those of other test pages, and only
				// drops them on hydration. Swap them for the styles this page loads itself,
				// which is what a production build would serve.
				const ownStyles = await hydratedPage.evaluate(() =>
					Array.from(
						document.querySelectorAll('style[data-vite-dev-id]'),
						(style) => style.textContent,
					).join('\n'),
				)
				await prerenderedPage.evaluate((styles) => {
					for (const inlinedStyle of document.querySelectorAll('style[data-sveltekit]')) {
						inlinedStyle.remove()
					}

					const style = document.createElement('style')
					style.textContent = styles
					document.head.append(style)
				}, ownStyles)

				const prerenderedSections = await getSections(prerenderedPage)
				expect(await prerenderedPage.content(), 'Placeholder sizes are valid CSS').not.toContain(
					'calc()',
				)
				await prerenderedPage.context().close()

				// Font metrics put a few controls a fraction of a pixel off, so compare to the nearest pixel
				await expect
					.poll(async () => getSections(hydratedPage))
					.toEqual(prerenderedSections.map(([name, height]) => [name, expect.closeTo(height, 0)]))
				await hydratedPage.context().close()
			})
		}
	}
})
