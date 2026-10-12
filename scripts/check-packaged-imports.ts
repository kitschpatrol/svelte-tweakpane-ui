// Svelte-package rewrites `#lib` subpath imports to relative paths. The published package.json
// still carries the `imports` map, which points at ./src, so any `#lib` left in dist would fail
// to resolve for consumers.

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Fails the build if any packaged file still references the `#lib` alias.
 */
export async function checkPackagedImports(): Promise<void> {
	const entries = await readdir('./dist', { recursive: true, withFileTypes: true })
	const files = entries
		.filter((entry) => entry.isFile())
		.map((entry) => path.join(entry.parentPath, entry.name))

	console.log(`Checking ${files.length} packaged files for unresolved #lib imports...`)

	const fileChecks = await Promise.all(
		files.map(async (filePath) => {
			const content = await readFile(filePath, 'utf8')
			return { filePath, unresolved: content.includes('#lib') }
		}),
	)
	const unresolvedFiles = fileChecks
		.filter(({ unresolved }) => unresolved)
		.map(({ filePath }) => filePath)

	if (unresolvedFiles.length > 0) {
		throw new Error(
			`Found unresolved #lib imports in ${unresolvedFiles.length} packaged files. Check that svelte-package still rewrites package.json "imports":\n${unresolvedFiles.join('\n')}`,
		)
	}

	console.log('Done.')
}
