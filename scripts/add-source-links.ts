// Replaces @sourceLink in jsdocs with GitHub URLs in source files References the git url provided
// in package.json.

import { getAllLibFiles } from './ast-tools';
import fs from 'fs';
import path from 'path';

const verbose = false;

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const sourceBaseUrl = packageJson.repository.url.replace('.git', '') + '/blob/main/';
const files = getAllLibFiles();

function addLinksToComponentBlock(filePath: string, baseUrl: string): void {
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const fileName = path.basename(filePath);
	const url = baseUrl + filePath;

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
			console.warn(`No @sourceLink found in ${url.replace(sourceBaseUrl, './')}`);
		}
	}
}

console.log(`Replacing @sourceLink with GitHub URLs in ${files.length} files...`);

files.forEach((filePath) => {
	addLinksToComponentBlock(filePath, sourceBaseUrl);
});

console.log(`Done.`);
