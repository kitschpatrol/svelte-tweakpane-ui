import fs from 'node:fs/promises'
import { getAllLibraryFiles, lintAndFormat } from './ast-tools'

// Assumes all code blocks are svelte-like
async function formatEmbeddedCodeInFile(file: string): Promise<number> {
	let embedsFormatted = 0
	try {
		const data = await fs.readFile(file, 'utf8')
		let formattedData = ''
		let lastIndex = 0
		const regex = /(```.*\n)([\s\S]*?)(\n```)/gv
		// eslint-disable-next-line ts/no-restricted-types
		let match: null | RegExpExecArray

		while ((match = regex.exec(data)) !== null) {
			const [fullMatch, opening, code, closing] = match
			const { index } = match

			// Append the part before this match.
			formattedData += data.slice(lastIndex, index)

			try {
				const formattedCode = await lintAndFormat(code)
				embedsFormatted++
				// Using the original opening and closing backticks
				formattedData += `${opening}${formattedCode.trimEnd()}${closing}`
			} catch (error) {
				console.error(
					`Error formatting code: ${error instanceof Error ? error.message : String(error)}`,
				)

				formattedData += fullMatch
			}

			lastIndex = index + fullMatch.length
		}

		// Append the remaining part of the file
		formattedData += data.slice(lastIndex)

		// Only write if necessary
		if (formattedData === data) {
			embedsFormatted = 0
		} else {
			await fs.writeFile(file, formattedData, 'utf8')
		}
	} catch (error) {
		console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
	}

	return embedsFormatted
}

export async function formatEmbeddedCode(): Promise<void> {
	const files = getAllLibraryFiles()

	console.log(
		`Checking ${files.length} files for embedded code blocks with incorrect formatting...`,
	)

	const results = await Promise.all(files.map(async (file) => formatEmbeddedCodeInFile(file)))

	const totalFilesTouched = results.filter((count) => count > 0).length
	const totalEmbedsFormatted = results.reduce((sum, count) => sum + count, 0)

	console.log(
		totalFilesTouched === 0
			? 'Embedded formatting is correct in all files.'
			: `Formatted ${totalEmbedsFormatted} embedded code blocks across ${totalFilesTouched} files.`,
	)
}
