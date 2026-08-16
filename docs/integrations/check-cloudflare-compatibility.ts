import type { AstroIntegration, AstroIntegrationLogger } from 'astro'
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Via https://developers.cloudflare.com/workers/platform/limits/#static-assets
const MAX_FILE_COUNT = 20_000
const MAX_FILE_SIZE_BYTES = 25_000_000

/**
 * Formats a byte count as a human-readable string (e.g. "25 MB").
 */
function formatBytes(bytes: number): string {
	if (!Number.isFinite(bytes)) {
		return `${bytes}`
	}

	if (Math.abs(bytes) < 1000) {
		return `${bytes} B`
	}

	const units = ['kB', 'MB', 'GB', 'TB', 'PB']
	const exponent = Math.min(Math.floor(Math.log10(Math.abs(bytes)) / 3), units.length)
	const value = bytes / 1000 ** exponent
	const formatted = value.toLocaleString('en-US', { maximumFractionDigits: 2 })
	return `${formatted} ${units[exponent - 1]}`
}

/**
 * Returns the singular or plural form of a word based on count.
 */
function pluralize(word: string, count: number): string {
	return count === 1 ? word : `${word}s`
}

/**
 * Recursively collects all file paths in a directory.
 */
async function getAllFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, { withFileTypes: true })
	const files: string[] = []

	for (const entry of entries) {
		const fullPath = join(directory, entry.name)
		if (entry.isDirectory()) {
			files.push(...(await getAllFiles(fullPath)))
		} else {
			files.push(fullPath)
		}
	}

	return files
}

/**
 * Validates that the build output meets Cloudflare Workers assets limitations.
 *
 * @throws {Error} If any file exceeds the max file size or if file count
 *   exceeds the max file count
 * @see https://developers.cloudflare.com/workers/platform/limits/#static-assets
 */
async function checkBuild(
	distributionDirectory: string,
	maxFileCount: number,
	maxFileSizeBytes: number,
	logger: AstroIntegrationLogger,
): Promise<void> {
	const files = await getAllFiles(distributionDirectory)

	let errorsFound = false

	const oversizeFiles: Array<{
		filePath: string
		size: number
	}> = []

	for (const filePath of files) {
		const stats = await stat(filePath)
		if (stats.size > maxFileSizeBytes) {
			oversizeFiles.push({ filePath, size: stats.size })
		}
	}

	if (files.length > maxFileCount) {
		errorsFound = true
		logger.error(
			`Dist directory contains more than ${maxFileCount.toLocaleString()} files: ${files.length.toLocaleString()}`,
		)
	}

	if (oversizeFiles.length > 0) {
		errorsFound = true
		const oversizeFilesList = oversizeFiles.map(
			(file) => `${file.filePath} (${formatBytes(file.size)})`,
		)
		logger.error(
			`Files are over ${formatBytes(maxFileSizeBytes)}: ${oversizeFilesList.join('\n▸ ')}`,
		)
	}

	if (errorsFound) {
		throw new Error('Build is invalid')
	}

	logger.info(
		`Build is valid with ${files.length.toLocaleString()} ${pluralize('file', files.length)} and no files over ${formatBytes(maxFileSizeBytes)}`,
	)
}

/**
 * Astro integration that fails the build if the output exceeds Cloudflare
 * Workers assets limitations (file count and per-file size).
 */
export default function checkCloudflareCompatibility(): AstroIntegration {
	let outputDirectory: string | undefined

	return {
		hooks: {
			async 'astro:build:done'({ logger }) {
				if (outputDirectory === undefined) {
					throw new Error('Resolved Astro config not available — astro:config:done did not run')
				}

				await checkBuild(outputDirectory, MAX_FILE_COUNT, MAX_FILE_SIZE_BYTES, logger)
			},
			'astro:config:done'({ config }) {
				outputDirectory = fileURLToPath(config.outDir)
			},
		},
		name: 'check-cloudflare-compatibility',
	}
}
