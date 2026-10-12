// Copies examples from kit src to docs
// changes import path, formats for narrower screens, and also generates markdown

import { globSync } from 'glob'
import fs from 'node:fs/promises'
import path from 'node:path'
import { getExportedComponents, getExportedJs, lintAndFormat } from './ast-tools'

// Leave this on
const reformat = true
const IMPORT_LIB_PATH_REGEX = /(['"])(#lib(?:\/[^'"]*)?)\1/gv

export async function generateExampleComponents(): Promise<void> {
	await fs.rm('./docs/src/examples', { force: true, recursive: true })

	await fs.cp('./src/examples', './docs/src/examples', { recursive: true })

	const files = globSync('./docs/src/examples/**/*.svelte', { posix: true })
	const libraryImports = new Map([
		['#lib', 'svelte-tweakpane-ui'],
		...getExportedComponents('./src/lib/index.ts').map(
			({ name, path: sourcePath }) => [sourcePath, `svelte-tweakpane-ui/${name}.svelte`] as const,
		),
		...getExportedJs('./src/lib/index.ts').map(
			({ name, path: sourcePath }) => [sourcePath, `svelte-tweakpane-ui/${name}.js`] as const,
		),
	])

	await Promise.all(
		files.map(async (filePath) => {
			try {
				const directory = path.dirname(filePath)
				const baseName = path.basename(filePath, '.svelte')

				// Optionally Re-format and save .svelte file
				let svelteContent = await fs.readFile(filePath, 'utf8')
				svelteContent = svelteContent.replaceAll(
					IMPORT_LIB_PATH_REGEX,
					(_match: string, quote: string, importPath: string) => {
						const publicImportPath = libraryImports.get(importPath)
						if (publicImportPath === undefined) {
							throw new Error(`No public export found for ${importPath}`)
						}

						return `${quote}${publicImportPath}${quote}`
					},
				)

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
}
