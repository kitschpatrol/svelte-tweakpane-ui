import { getAllLibFiles, lintAndFormat } from './ast-tools';
import fs from 'fs';

// assumes all code blocks are svelte-like
async function formatEmbeddedCode(file: string): Promise<number> {
	let embedsFormatted = 0;
	try {
		const data = fs.readFileSync(file, 'utf8');
		let formattedData = '';
		let lastIndex = 0;
		const regex = /(```.*\n)([\s\S]*?)(\n```)/g;
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
			} catch (e) {
				console.error(`Error formatting code: ${e}`);
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
	} catch (err) {
		console.error(`Error: ${err}`);
	}
	return embedsFormatted;
}

const files = getAllLibFiles();

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
