import { execaCommand } from 'execa'
import { mkdir, writeFile } from 'node:fs/promises'
import { generateVersionJson } from './generate-version-json'
import { migrateIndex } from './migrate-index'

const startTime = performance.now()

console.log('Starting docs build script in ./docs/scripts/build.ts')

// 1. Generate acknowledgments data
await mkdir('src/content/acknowledgments', { recursive: true })
await run('pnpm licenses list --json > ./src/content/acknowledgments/acknowledgments-docs.json')

// 2. Build Astro site
await serial('astro sync', 'astro build')

// 3. Post-build: generate version JSON and fix Cloudflare redirects
await parallel(
	// Save version json file at root of ite
	async () => {
		const versionJson = await generateVersionJson()
		await writeFile('./dist/svelte-tweakpane-ui/version.json', versionJson)
	},
	// Cloudflare fix...
	migrateIndex,
)

console.log(
	`Docs build completed. Duration: ${((performance.now() - startTime) / 1000).toFixed(1)}s`,
)

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
