/* eslint-disable unicorn/prefer-top-level-await */

import { execaCommand } from 'execa'
import { mkdir } from 'node:fs/promises'
import prettyMs from 'pretty-ms'
import { addSourceLinks } from './add-source-links'
import { formatEmbeddedCode } from './format-embedded-code'
import { generateDocumentationData } from './generate-documentation-data'
import { generateExampleComponents } from './generate-example-components'
import { generateExports } from './generate-exports'
import { generateKitExamples } from './generate-kit-examples'
import { healDtsComments } from './heal-dts-comments'
import { stripComponentDocumentation } from './strip-component-documentation'

// Takes about ~40s locally

const startTime = performance.now()

console.log('Starting build script in ./scripts/build.ts')

// 1. Sync and package the Svelte component library (~14s)
await mkdir('./docs/src/content/acknowledgments', { recursive: true })
await parallel(
	// Generate library types
	'svelte-kit sync',
	// Generate documentation site types
	'pnpm -C ./docs run sync',
)
await parallel(
	// Update package.json with component exports
	generateExports,
	// Replace placeholder links in @component jsdoc
	// with links to actual github source
	addSourceLinks,
)
await parallel(
	// Format package.json to clean up after generateExports pass
	serial('ksc-eslint fix package.json', 'ksc-prettier fix package.json'),
	// Generate component list in readme
	'ksc-mdat fix readme.md',
	// Customize formatting for embedded code examples in @component jsdoc
	formatEmbeddedCode,
)
await run(
	// Create the Svelte component package
	'svelte-package',
)

// 2. Clean up Svelte component library
await parallel(
	// Fix missing comments in component type files
	// A brittle PITA: https://github.com/sveltejs/language-tools/issues/2186
	healDtsComments,
	// Don't need @component jsdoc in .svelte files when we have it in .svelte.d.ts files
	stripComponentDocumentation,
)
await run(
	// Clean up the now-mangled component library files
	'prettier --ignore-path --plugin prettier-plugin-svelte --write ./dist',
)

// 3. Generate content + acknowledgments for doc site and demo project
await parallel(
	// Extract type info from components for doc site
	generateDocumentationData,
	// Generate component example pages for demo project
	generateKitExamples,
	// Generate component example Markdown for doc site
	generateExampleComponents,
	// Use pnpm's built-in licenses command to get data for acknowledgements in docs
	// Note that this is separate from the docs acknowledgements data generated in the docs package
	'pnpm licenses list --json > ./docs/src/content/acknowledgments/acknowledgments-lib.json',
)

// 4. Build doc site + demo project and validate package
await parallel(
	// Build documentation site
	'pnpm -C ./docs run build',
	// Build the demo SvelteKit 4 project
	'vite build',
	// Validate final Svelte component library package
	'publint',
)

console.log(`Build completed. Total build duration: ${prettyMs(performance.now() - startTime)}`)

// Run helpers

async function run(command: string): Promise<void> {
	await execaCommand(command, { shell: true, stdio: 'inherit' })
}

type Step = (() => Promise<void> | void) | Promise<void> | string

async function resolve(step: Step): Promise<void> {
	if (typeof step === 'string') return run(step)
	if (typeof step === 'function') {
		await step()
		return
	}

	return step
}

async function serial(...steps: Step[]): Promise<void> {
	for (const step of steps) await resolve(step)
}

async function parallel(...steps: Step[]): Promise<void> {
	await Promise.all(steps.map(async (step) => resolve(step)))
}
