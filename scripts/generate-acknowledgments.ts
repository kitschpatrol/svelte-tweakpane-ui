import { execa } from 'execa'
import { mkdir, writeFile } from 'node:fs/promises'

const OUTPUT_DIRECTORY = './docs/src/content/acknowledgments'

function extractJson(stdout: string, cwd: string): string {
	// The pnpm CLI prints warnings such as `[WARN] …` to stdout ahead of the JSON,
	// so try each line that could begin the JSON until one parses.
	let offset = 0
	for (const line of stdout.split('\n')) {
		if (line.startsWith('{') || line.startsWith('[')) {
			const candidate = stdout.slice(offset)
			try {
				JSON.parse(candidate)
				return candidate
			} catch {
				// Not the start of the JSON, keep looking
			}
		}

		offset += line.length + 1
	}

	throw new Error(`Expected JSON from "pnpm licenses list --json" in ${cwd}, received:\n${stdout}`)
}

async function writeLicenses(cwd: string, outputPath: string): Promise<void> {
	const { stdout } = await execa('pnpm', ['licenses', 'list', '--json'], { cwd })
	await writeFile(outputPath, extractJson(stdout, cwd))
}

/**
 * Uses pnpm's built-in licenses command to get data for the acknowledgments
 * page in the docs site, covering both the library and the docs site itself.
 * Output is validated and written only on success, so a pnpm failure or stray
 * warning can't leave behind a malformed file that breaks content collection
 * validation in subsequent builds.
 */
export async function generateAcknowledgments(): Promise<void> {
	await mkdir(OUTPUT_DIRECTORY, { recursive: true })
	await Promise.all([
		writeLicenses('.', `${OUTPUT_DIRECTORY}/acknowledgments-lib.json`),
		writeLicenses('./docs', `${OUTPUT_DIRECTORY}/acknowledgments-docs.json`),
	])
}
