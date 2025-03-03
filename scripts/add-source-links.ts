// Replaces @sourceLink in JSDocs with GitHub URLs in source files References the git url provided
// in package.json.

import fs from 'node:fs'
import path from 'node:path'
import { getAllLibraryFiles, getGithubUrlForSourceFile } from './ast-tools'

const verbose = false

const files = getAllLibraryFiles()

async function addLinksToComponentBlock(filePath: string): Promise<void> {
	const fileContent = fs.readFileSync(filePath, 'utf8')
	const fileName = path.basename(filePath)
	const url = await getGithubUrlForSourceFile(filePath)

	// If the markdown link is already there, it will work out to a no-op if it needs an update, this
	// will do it...
	const updatedContent = fileContent.replace(
		/@sourceLink(.+\))?\n/s,
		`@sourceLink\n[${fileName}](${url})\n`,
	)

	if (fileContent === updatedContent) {
		// Warn if we have undocumented svelte components
		if (filePath.endsWith('.svelte') && !fileContent.includes('@sourceLink')) {
			console.warn(`No @sourceLink found in ${filePath}`)
		}
	} else {
		if (verbose) console.log(`Added source links to ${filePath}`)
		fs.writeFileSync(filePath, updatedContent, 'utf8')
	}
}

console.log(`Replacing @sourceLink with GitHub URLs in ${files.length} files...`)

for (const filePath of files) {
	await addLinksToComponentBlock(filePath)
}

console.log(`Done.`)
