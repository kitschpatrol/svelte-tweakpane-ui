/* eslint-disable unicorn/no-null */
/* eslint-disable ts/no-restricted-types */

import type { AstroIntegration } from 'astro'
import { execFile } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

async function execFileAsync(
	file: string,
	args: string[],
): Promise<{ stderr: string; stdout: string }> {
	return new Promise((resolve, reject) => {
		execFile(file, args, (error, stdout, stderr) => {
			if (error === null) {
				resolve({ stderr, stdout })
			} else {
				reject(new Error(`execFile ${file} failed: ${error.message}`, { cause: error }))
			}
		})
	})
}

type GitInfo = {
	branch: null | string
	commit: null | string
	commitDate: null | string
	tag: null | string
}

async function getGitInfo(): Promise<GitInfo> {
	const info: GitInfo = { branch: null, commit: null, commitDate: null, tag: null }

	const run = async (args: string[]): Promise<null | string> => {
		try {
			const { stdout } = await execFileAsync('git', args)
			return stdout.trim()
		} catch {
			return null
		}
	}

	info.tag = await run(['describe', '--tags', '--abbrev=0'])
	info.commit = await run(['rev-parse', '--short', 'HEAD'])
	info.branch = await run(['rev-parse', '--abbrev-ref', 'HEAD'])

	const rawDate = await run(['log', '-1', '--format=%cI'])
	if (rawDate !== null && rawDate !== '') {
		info.commitDate = new Date(rawDate).toISOString()
	}

	return info
}

type PackageInfo = {
	name: null | string
	version: null | string
}

async function readPackageUp(startDirectory: string): Promise<null | Record<string, unknown>> {
	let directory = startDirectory
	// eslint-disable-next-line ts/no-unnecessary-condition
	while (true) {
		try {
			const pkgPath = join(directory, 'package.json')
			const contents = await readFile(pkgPath, 'utf8')
			// eslint-disable-next-line ts/no-unsafe-return
			return JSON.parse(contents)
		} catch {
			const parent = dirname(directory)
			if (parent === directory) {
				return null
			}

			directory = parent
		}
	}
}

function parsePrerelease(version: null | string | undefined): string[] {
	if (typeof version !== 'string' || version === '') {
		return []
	}

	// E.g. "1.2.3-beta.1" → ["beta", "1"]
	const hyphen = version.indexOf('-')
	if (hyphen === -1) {
		return []
	}

	return version.slice(hyphen + 1).split('.')
}

async function getPackageInfo(startDirectory: string): Promise<PackageInfo> {
	const pkg = await readPackageUp(startDirectory)
	return {
		// eslint-disable-next-line ts/no-unnecessary-condition
		name: (pkg?.name as string) ?? null,
		// eslint-disable-next-line ts/no-unnecessary-condition
		version: (pkg?.version as string) ?? null,
	}
}

/**
 * Astro integration that writes a `version.json` file with the build date and
 * package and git metadata to the site's base path in the build output.
 */
export default function saveVersionJson(): AstroIntegration {
	let root = process.cwd()

	return {
		hooks: {
			async 'astro:build:done'({ dir, logger }) {
				const packageInfo = await getPackageInfo(root)
				const prerelease = parsePrerelease(packageInfo.version)

				const versionJson = {
					date: new Date().toISOString(),
					deployment: prerelease.length === 0 ? 'main' : 'preview',
					git: await getGitInfo(),
					package: packageInfo,
				}

				// `dir` is the client output directory, which already includes the
				// site's base path (e.g. dist/client/x/cma/ten-kings/)
				const versionJsonPath = join(fileURLToPath(dir), 'version.json')
				await writeFile(versionJsonPath, JSON.stringify(versionJson, undefined, 2))
				logger.info(`Wrote ${versionJsonPath}`)
			},
			'astro:config:done'({ config }) {
				root = fileURLToPath(config.root)
			},
		},
		name: 'save-version-json',
	}
}
