// Replaces @sourceLink with GitHub URLs in dist .d.ts files.

import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';

const verbose = false;

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const sourceBaseUrl = packageJson.repository.url.replace('.git', '') + '/blob/main/';

const definitionFiles = globSync(`./dist/**/*.d.ts`);

function addLinksToComponentBlock(filePath: string, baseUrl: string): void {
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	const componentName = path.basename(filePath).replace('.d.ts', '');
	const url = baseUrl + filePath.replace('dist/', 'src/lib/').replace('.d.ts', '');

	const updatedContent = fileContent.replace('@sourceLink', `Source: [${componentName}](${url})`);

	if (fileContent !== updatedContent) {
		verbose && console.log(`Added source links to ${filePath}`);
		fs.writeFileSync(filePath, updatedContent, 'utf-8');
	} else {
		// warn if we have undocumented svelte components
		if (filePath.endsWith('svelte.d.ts')) {
			console.warn(`No @sourceLink found in ${url.replace(sourceBaseUrl, './')}`);
		}
	}
}

console.log(`Replacing @sourceLink with GitHub URLs in ${definitionFiles.length} files...`);

definitionFiles.forEach((filePath) => {
	addLinksToComponentBlock(filePath, sourceBaseUrl);
});

console.log(`Done.`);
