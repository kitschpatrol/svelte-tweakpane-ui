// There's redundant @component documentation between the svelte file and the svelte.d.ts file

import { globSync } from 'glob';
import { readFileSync, writeFileSync } from 'node:fs';

const verbose = false;

function removeComponentBlock(filePath: string): void {
	// Read the file
	const fileContent = readFileSync(filePath, 'utf8');

	// Use regular expression to remove everything between <!-- @component and -->
	const updatedContent = fileContent.replaceAll(/<!--\s*@component[\S\s]*?-->/g, '');

	if (fileContent === updatedContent) {
		if (verbose) console.log(`No @component comment found in ${filePath}`);
	} else {
		if (verbose) console.log(`Stripped @component comment from ${filePath}`);
		writeFileSync(filePath, updatedContent, 'utf8');
	}
}

const svelteFiles = globSync(`./dist/**/*.svelte`);

console.log(`Removing @component blocks from ${svelteFiles.length} Svelte files...`);
console.log(`Documentation is preserved in .svelte.d.ts files.`);

for (const filePath of svelteFiles) {
	removeComponentBlock(filePath);
}

console.log(`Done.`);
