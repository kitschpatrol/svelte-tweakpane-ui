import type { Loader } from 'astro/loaders'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const TITLE_HEADING_REGEX = /^# .*\n+/mv
const SECTION_END_REGEX = /^(?:## |\[[^\]]+\]:)/v

/**
 * Removes the Unreleased section and its link definition, since the
 * documentation site describes the published package.
 */
function stripUnreleased(markdown: string): string {
	const keptLines: string[] = []
	let inUnreleasedSection = false

	for (const line of markdown.split('\n')) {
		if (line.startsWith('## [Unreleased]')) {
			inUnreleasedSection = true
			continue
		}

		if (inUnreleasedSection && SECTION_END_REGEX.test(line)) {
			inUnreleasedSection = false
		}

		if (!inUnreleasedSection && !line.startsWith('[Unreleased]:')) {
			keptLines.push(line)
		}
	}

	return keptLines.join('\n')
}

/**
 * Loads the changelog that the docs build script copies to
 * `src/content/changelog.md` as a single entry with the id `changelog`,
 * rendered through Astro's Markdown pipeline. The title heading is dropped
 * because the page supplies its own.
 *
 * A missing copy only logs a warning, so `astro sync` still works before the
 * first docs build.
 */
export function changelogLoader(): Loader {
	return {
		async load(context) {
			const { config, logger, store } = context
			const changelogPath = fileURLToPath(new URL('src/content/changelog.md', config.root))

			let changelog: string
			try {
				changelog = await readFile(changelogPath, 'utf8')
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
					throw error
				}

				logger.warn(
					`No changelog found at "${changelogPath}", run the docs build script to copy it`,
				)
				store.clear()
				return
			}

			const body = stripUnreleased(changelog.replace(TITLE_HEADING_REGEX, ''))

			store.set({
				body,
				data: {},
				digest: context.generateDigest(body),
				id: 'changelog',
				rendered: await context.renderMarkdown(body),
			})
		},
		name: 'changelog-loader',
	}
}
