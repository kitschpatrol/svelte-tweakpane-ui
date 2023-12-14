import { getAllLibraryFiles, lintAndFormat } from './ast-tools';
import fs from 'node:fs';

// Assumes all code blocks are svelte-like
async function formatEmbeddedCode(file: string): Promise<number> {
	let embedsFormatted = 0;
	try {
		const data = fs.readFileSync(file, 'utf8');
		let formattedData = '';
		let lastIndex = 0;
		const regex = /(```.*\n)([\S\s]*?)(\n```)/g;
		// eslint-disable-next-line @typescript-eslint/ban-types
		let match: RegExpExecArray | null;

		while ((match = regex.exec(data)) !== null) {
			const [fullMatch, opening, code, closing] = match;
			const { index } = match;

			// Append the part before this match.
			formattedData += data.slice(lastIndex, index);

			try {
				const formattedCode = await lintAndFormat(code);
				embedsFormatted++;
				// Using the original opening and closing backticks
				formattedData += `${opening}${formattedCode.trimEnd()}${closing}`;
			} catch (error) {
				if (error instanceof Error) {
					console.error(`Error formatting code: ${error.message}`);
				} else {
					console.error(`Error formatting code: ${String(error)}`);
				}

				formattedData += fullMatch;
			}

			lastIndex = index + fullMatch.length;
		}

		// Append the remaining part of the file
		formattedData += data.slice(lastIndex);

		// Only write if necessary
		if (formattedData === data) {
			embedsFormatted = 0;
		} else {
			fs.writeFileSync(file, formattedData, 'utf8');
		}
	} catch (error) {
		if (error instanceof Error) {
			console.error(`Error: ${error.message}`);
		} else {
			console.error(`Error: ${String(error)}`);
		}
	}

	return embedsFormatted;
}

const files = getAllLibraryFiles();

console.log(`Checking ${files.length} files for embedded code blocks with incorrect formatting...`);

let totalEmbedsFormatted = 0;
let totalFilesTouched = 0;
for (const file of files) {
	const count = await formatEmbeddedCode(file);
	if (count > 0) totalFilesTouched++;
	totalEmbedsFormatted += count;
}

if (totalFilesTouched === 0) {
	console.log(`Embedded formatting is correct in all files.`);
} else {
	console.log(
		`Formatted ${totalEmbedsFormatted} embedded code blocks across ${totalFilesTouched} files.`
	);
}
