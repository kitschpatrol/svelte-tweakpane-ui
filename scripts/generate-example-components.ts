import {
	getComponentExampleCodeFromSource,
	getExportedComponents,
	lintAndFormat
} from './ast-tools';
import fs from 'fs';
import path from 'path';

// fishes out all the @example sections of the component source files,
// and writes out a svelte component for each
// code's technically already formatted in the source files, but it happens again in
// getComponentExampleCodeFromSource because parsing to ast removes it

const verbose = false;

// returns true on success
async function generateExampleComponent(
	name: string,
	suffix: string,
	destination: string
): Promise<boolean> {
	let exampleComponentText = await getComponentExampleCodeFromSource(name);

	if (exampleComponentText) {
		// add comment
		// exampleComponentText = `${exampleComponentText.replace(/'svelte-tweakpane-ui'/, "'$lib'")}`;
		exampleComponentText = await lintAndFormat(exampleComponentText);

		// overwrites existing, creates intermediate directories
		const resolvedPath = path.resolve(`${destination}/${name}${suffix}.svelte`);
		fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
		fs.writeFileSync(resolvedPath, exampleComponentText);
		return true;
	} else {
		return false;
	}
}

// returns true on success
async function generateExampleMarkdown(
	name: string,
	suffix: string,
	destination: string
): Promise<boolean> {
	const exampleComponentText = (await getComponentExampleCodeFromSource(name, true)) + '\n';

	if (exampleComponentText) {
		// overwrites existing, creates intermediate directories
		const resolvedPath = path.resolve(`${destination}/${name}${suffix}.md`);
		fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
		fs.writeFileSync(resolvedPath, exampleComponentText);
		return true;
	} else {
		return false;
	}
}

function deleteExisting(destination: string) {
	if (fs.existsSync(destination)) {
		console.log(`Removing existing files at "${destination}"...`);
		fs.rmSync(destination, { recursive: true });
	}
}

// main
let totalComponentsGenerated = 0;
let totalMarkdownGenerated = 0;

const components = getExportedComponents('./src/lib/index.ts');
const markdownDestination = './docs/src/components/examples/markdown';
const componentDestination = './docs/src/components/examples/svelte';

console.log(`Generating documentation components for ${components.length} components...`);

deleteExisting(componentDestination);
deleteExisting(markdownDestination);

for (const { name } of components) {
	verbose && console.log(`Generating example component for "${name}"...`);
	if (await generateExampleComponent(name, 'Example', componentDestination)) {
		totalComponentsGenerated++;
	} else {
		console.warn(`No example code found in "${name}.svelte"`);
	}

	verbose && console.log(`Generating example markdown for "${name}"...`);
	if (await generateExampleMarkdown(name, 'Example', markdownDestination)) {
		totalMarkdownGenerated++;
	} else {
		console.warn(`No example code found in "${name}.svelte"`);
	}
}

console.log(
	`Found and created ${totalComponentsGenerated} example components in "${componentDestination}".\n` +
		`Found and created ${totalMarkdownGenerated} example markdown files in "${markdownDestination}".\n` +
		'Done.'
);
