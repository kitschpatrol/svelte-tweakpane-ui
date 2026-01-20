// There's redundant @component documentation between the svelte file and the svelte.d.ts file

import { globSync } from 'glob'
import { readFile, writeFile } from 'node:fs/promises'

const verbose = false

async function removeComponentBlock(filePath: string): Promise<void> {
	// Read the file
	const fileContent = await readFile(filePath, 'utf8')

	// Use regular expression to remove everything between <!-- @component and -->
	const updatedContent = fileContent.replaceAll(/<!--\s*@component[\s\S]*?-->/g, '')

	if (fileContent === updatedContent) {
		// eslint-disable-next-line ts/no-unnecessary-condition
		if (verbose) console.log(`No @component comment found in ${filePath}`)
	} else {
		// eslint-disable-next-line ts/no-unnecessary-condition
		if (verbose) console.log(`Stripped @component comment from ${filePath}`)
		await writeFile(filePath, updatedContent, 'utf8')
	}
}

const svelteFiles = globSync(`./dist/**/*.svelte`)

console.log(`Removing @component blocks from ${svelteFiles.length} Svelte files...`)
console.log(`Documentation is preserved in .svelte.d.ts files.`)

await Promise.all(svelteFiles.map(async (filePath) => removeComponentBlock(filePath)))

console.log(`Done.`)
