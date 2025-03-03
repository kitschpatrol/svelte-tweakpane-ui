// Inspired by https://github.com/shinokada/svelte-lib-helpers

import fs from 'node:fs'
import { readPackageUp, type ReadResult } from 'read-package-up'
import { getExportedComponents, getExportedJs } from './ast-tools'

const verbose = false

type Export = { default?: string; svelte?: string; types: string }
type Exports = Record<string, Export>

// Gets all props for a given component from its definition file
function addExports(sourceIndexFile: string, closestPackage: ReadResult) {
	const { path } = closestPackage

	console.log(`Adding Svelte components found in ${sourceIndexFile} to ${path}`)

	// Default export
	const exports: Exports = {
		'.': {
			types: './dist/index.d.ts',
			// eslint-disable-next-line perfectionist/sort-objects
			svelte: './dist/index.js',
		},
	}

	// Extract components from index file
	for (const component of getExportedComponents(sourceIndexFile)) {
		const { name, path } = component

		const key = `./${name}.svelte`
		const types = `./dist/${path.replace('$lib/', '')}.d.ts`
		const svelte = `./dist/${path.replace('$lib/', '')}`
		// eslint-disable-next-line perfectionist/sort-objects
		exports[key] = { types, svelte }

		if (verbose) console.log(exports[key])
	}

	// Extract JS exports from index file (like Utils, etc.)
	for (const file of getExportedJs(sourceIndexFile)) {
		const { name, path } = file

		const key = `./${name}.js`
		const types = `./dist/${path.replace('.js', '').replace('$lib/', '')}.d.ts`
		const defaultValue = `./dist/${path.replace('$lib/', '')}`
		// eslint-disable-next-line perfectionist/sort-objects
		exports[key] = { types, default: defaultValue }

		if (verbose) console.log(exports[key])
	}

	// Save to package.json
	const { packageJson } = closestPackage

	packageJson.exports = exports
	packageJson.types = './dist/index.d.ts'

	// Deprecated, Astro complains
	// https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#conflicts-in-svelte-resolve
	// packageJson.svelte = './dist/index.d.ts';

	fs.writeFileSync(path, JSON.stringify(packageJson, undefined, 2))

	console.log(
		`Done. Wrote 'types' and ${
			Object.keys(exports).length - 1
		} component 'exports' values to ${path}.`,
	)
}

const closestPackage = await readPackageUp({ normalize: false })

if (closestPackage === undefined) {
	throw new Error('Could not find package.json')
} else {
	addExports('./src/lib/index.ts', closestPackage)
}
