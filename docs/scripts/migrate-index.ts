// Fix Cloudflare 308 trailing slash redirect issue
// Replaces migrate-index.sh with a cross-platform Node.js implementation
// https://community.cloudflare.com/t/cloudflare-pages-get-rid-of-redundat-308-redirect/324582/29
// https://electricui.com/blog/switching-to-cloudflare-pages#how-to-disable-the-trailing-slash-on-cloudflare-pages

import { readdirSync, renameSync, rmdirSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'

const PATH_SEPARATOR_REGEX = /[\\\/]/v

export function migrateIndex(): void {
	const distributionDirectory = resolve('dist')

	function findIndexFiles(directory: string): string[] {
		const results: string[] = []
		const entries = readdirSync(directory, { withFileTypes: true })
		for (const entry of entries) {
			const fullPath = join(directory, entry.name)
			if (entry.isDirectory()) {
				results.push(...findIndexFiles(fullPath))
			} else if (entry.isFile() && entry.name === 'index.html') {
				// Equivalent to find's -mindepth 2: skip index.html directly inside dist root
				const depth = relative(distributionDirectory, fullPath).split(PATH_SEPARATOR_REGEX).length
				if (depth >= 2) {
					results.push(fullPath)
				}
			}
		}

		return results
	}

	// Move each nested index.html up one level, renaming to its parent directory name
	for (const file of findIndexFiles(distributionDirectory)) {
		const parent = dirname(file)
		const grandparent = dirname(parent)
		const newName = `${basename(parent)}.html`
		renameSync(file, join(grandparent, newName))
	}

	// Remove empty directories
	function removeEmptyDirectories(directory: string): void {
		const entries = readdirSync(directory, { withFileTypes: true })
		for (const entry of entries) {
			if (!entry.isDirectory()) {
				continue
			}

			const fullPath = join(directory, entry.name)
			removeEmptyDirectories(fullPath)
			try {
				rmdirSync(fullPath)
			} catch {
				// Directory not empty, skip
			}
		}
	}

	removeEmptyDirectories(distributionDirectory)
}
