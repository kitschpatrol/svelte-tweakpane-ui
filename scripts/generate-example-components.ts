// copies examples from kit src to docs
// changes import path, formats for narrower screens, and also generates markdown

import { lintAndFormat } from './ast-tools';
import fs from 'fs-extra';
import { globSync } from 'glob';
import path from 'path';

fs.rmSync('./docs/src/examples', { force: true, recursive: true });
fs.copySync('./src/examples', './docs/src/examples');

globSync('./docs/src/examples/**/*.svelte').forEach(async (filePath) => {
	try {
		const dir = path.dirname(filePath);
		const baseName = path.basename(filePath, '.svelte');

		// re-format and save .svelte file
		let svelteContent = fs.readFileSync(filePath, 'utf-8');
		svelteContent = svelteContent.replace(/'\$lib/, "'svelte-tweakpane-ui");
		const formattedSvelteContent = await lintAndFormat(svelteContent, 'svelte');
		fs.writeFileSync(filePath, formattedSvelteContent);

		// generate markdown with title
		const markdownContent = '```svelte title="' + baseName + '.svelte"\n' + svelteContent + '```\n';
		const markdownPath = path.join(dir, `${baseName}.md`);
		fs.writeFileSync(markdownPath, markdownContent);
	} catch (error) {
		console.error(`Error processing file ${filePath}:`, error);
	}
});
