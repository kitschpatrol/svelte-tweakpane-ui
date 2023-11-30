import fs from 'fs-extra';
import { globSync } from 'glob';
import path from 'path';

// copies examples from kit src to docs,
// changes import path, and generates markdown
fs.rmSync('./docs/src/examples', { force: true, recursive: true });
fs.copySync('./src/examples', './docs/src/examples');

globSync('./docs/src/examples/**/*.svelte').forEach((filePath) => {
	try {
		const dir = path.dirname(filePath);
		const baseName = path.basename(filePath, '.svelte');

		// Create 'svelte' and 'markdown' directories if they don't exist
		const svelteDir = path.join(dir, 'svelte');
		const markdownDir = path.join(dir, 'markdown');
		fs.ensureDirSync(svelteDir);
		fs.ensureDirSync(markdownDir);

		// Move the .svelte file to the svelte directory
		const newSveltePath = path.join(svelteDir, `${baseName}.svelte`);
		fs.moveSync(filePath, newSveltePath);

		// Generate .md file based on the .svelte file's content
		// Update imports
		let svelteContent = fs.readFileSync(newSveltePath, 'utf-8');
		svelteContent = svelteContent.replace(/'\$lib/, "'svelte-tweakpane-ui");
		fs.writeFileSync(newSveltePath, svelteContent);

		// generate markdown
		const markdownContent = '```svelte\n' + svelteContent + '\n```\n';
		const markdownPath = path.join(markdownDir, `${baseName}.md`);
		fs.writeFileSync(markdownPath, markdownContent);
	} catch (error) {
		console.error(`Error processing file ${filePath}:`, error);
	}
});
