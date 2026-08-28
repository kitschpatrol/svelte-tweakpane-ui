import { execa } from 'execa'
import { writeFile } from 'node:fs/promises'

/**
 * Uses pnpm's built-in licenses command to get data for acknowledgments in the
 * docs site. Output is captured and written only on success, so a pnpm failure
 * can't leave behind a malformed file that breaks content collection validation
 * in subsequent builds.
 *
 * Note that this is separate from the docs acknowledgments data generated in
 * the docs package.
 */
export async function generateLibAcknowledgments(): Promise<void> {
	const { stdout } = await execa('pnpm', ['licenses', 'list', '--json'])
	await writeFile('./docs/src/content/acknowledgments/acknowledgments-lib.json', stdout)
}
