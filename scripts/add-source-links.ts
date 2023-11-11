// Replaces @sourceLink in JSDocs with GitHub URLs in source files References the git url provided
// in package.json.

import { getAllLibFiles, getGithubUrlForSourceFile } from './ast-tools';
import fs from 'fs';
import path from 'path';

const verbose = false;

const files = getAllLibFiles();

function addLinksToComponentBlock(filePath: string): void {
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const fileName = path.basename(filePath);
	const url = getGithubUrlForSourceFile(filePath);

	// if the markdown link is already there, it will work out to a no-op if it needs an update, this
	// will do it...
	const updatedContent = fileContent.replace(
		/@sourceLink(.+\))?\n/s,
		`@sourceLink\n[${fileName}](${url})\n`
	);

	if (fileContent !== updatedContent) {
		verbose && console.log(`Added source links to ${filePath}`);
		fs.writeFileSync(filePath, updatedContent, 'utf-8');
	} else {
		// warn if we have undocumented svelte components
		if (filePath.endsWith('.svelte') && !fileContent.includes('@sourceLink')) {
			console.warn(`No @sourceLink found in ${filePath}`);
		}
	}
}

console.log(`Replacing @sourceLink with GitHub URLs in ${files.length} files...`);

files.forEach((filePath) => {
	addLinksToComponentBlock(filePath);
});

console.log(`Done.`);
