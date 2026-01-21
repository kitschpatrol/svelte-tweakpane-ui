// Copies examples from kit src to docs
// changes import path, formats for narrower screens, and also generates markdown

import { globSync } from 'glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { lintAndFormat } from './ast-tools'

await fs.rm('./docs/src/examples', { force: true, recursive: true })
// eslint-disable-next-line node/no-unsupported-features/node-builtins
await fs.cp('./src/examples', './docs/src/examples', { recursive: true })

// Leave this on
const reformat = true

const files = globSync('./docs/src/examples/**/*.svelte')

await Promise.all(
	files.map(async (filePath) => {
		try {
			const directory = path.dirname(filePath)
			const baseName = path.basename(filePath, '.svelte')

			// Optionally Re-format and save .svelte file
			let svelteContent = await fs.readFile(filePath, 'utf8')
			svelteContent = svelteContent.replace(/'\$lib/, "'svelte-tweakpane-ui")

			// eslint-disable-next-line ts/no-unnecessary-condition
			const formattedSvelteContent = reformat
				? await lintAndFormat(svelteContent, 'svelte')
				: svelteContent

			await fs.writeFile(filePath, formattedSvelteContent)

			// Generate markdown with title
			const markdownContent =
				'```svelte title="' + baseName + '.svelte"\n' + formattedSvelteContent + '```\n'
			const markdownPath = path.join(directory, `${baseName}.md`)
			await fs.writeFile(markdownPath, markdownContent)
		} catch (error) {
			console.error(`Error processing file ${filePath}:`, error)
		}
	}),
)
