// there's redundant @component documentation between the svelte file and the svelte.d.ts file

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const verbose = false;

function removeComponentBlock(filePath: string): void {
	// Read the file
	const fileContent = readFileSync(filePath, 'utf-8');

	// Use regular expression to remove everything between <!-- @component and -->
	const updatedContent = fileContent.replace(/<!--\s*@component[\s\S]*?-->/g, '');

	if (fileContent !== updatedContent) {
		verbose && console.log(`Stripped @component comment from ${filePath}`);
		writeFileSync(filePath, updatedContent, 'utf-8');
	} else {
		verbose && console.log(`No @component comment found in ${filePath}`);
	}
}

const svelteFiles = globSync(`./dist/**/*.svelte`);

console.log(`Removing @component blocks from ${svelteFiles.length} svelte files...`);
console.log(`Documentation is preserved in .svelte.d.ts files.`);

svelteFiles.forEach((filePath) => {
	removeComponentBlock(filePath);
});

console.log(`Done.`);
