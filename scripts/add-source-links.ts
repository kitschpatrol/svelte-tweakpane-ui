// Replaces @sourceLink in JSDocs with GitHub URLs in source files References the git url provided
// in package.json.

import fs from 'node:fs/promises'
import path from 'node:path'
import { getAllLibraryFiles, getGithubUrlForSourceFile } from './ast-tools'

const verbose = false
const SOURCE_LINK_MARKER_REGEX = /@sourceLink(?:.+\))?\n/sv

async function addLinksToComponentBlock(filePath: string): Promise<void> {
	const fileContent = await fs.readFile(filePath, 'utf8')
	const fileName = path.basename(filePath)
	const url = await getGithubUrlForSourceFile(filePath)

	// If the markdown link is already there, it will work out to a no-op if it needs an update, this
	// will do it...
	const updatedContent = fileContent.replace(
		SOURCE_LINK_MARKER_REGEX,
		() => `@sourceLink\n[${fileName}](${url})\n`,
	)

	if (fileContent === updatedContent) {
		// Warn if we have undocumented svelte components
		if (filePath.endsWith('.svelte') && !fileContent.includes('@sourceLink')) {
			console.warn(`No @sourceLink found in ${filePath}`)
		}
	} else {
		// eslint-disable-next-line ts/no-unnecessary-condition
		if (verbose) {
			console.log(`Added source links to ${filePath}`)
		}

		await fs.writeFile(filePath, updatedContent, 'utf8')
	}
}

export async function addSourceLinks(): Promise<void> {
	const files = getAllLibraryFiles()

	console.log(`Replacing @sourceLink with GitHub URLs in ${files.length} files...`)

	await Promise.all(files.map(async (filePath) => addLinksToComponentBlock(filePath)))

	console.log('Done.')
}
