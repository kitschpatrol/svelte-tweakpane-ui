import { createMarkdownParser } from '@svelteness/kit-docs/node';
import fs from 'fs';
import path from 'path';
import { getComponentExampleCodeFromSource, getExportedComponents } from './ast-tools';

// fishes out all the @example sections of the component source files,
// and writes out a svelte component for each
// code's technically already formatted in the source files, but it happens again in
// getComponentExampleCodeFromSource because parsing to ast removes it

// returns true on success
async function generateExampleComponent(
	name: string,
	suffix: string,
	destination: string
): Promise<boolean> {
	let exampleComponentText = await getComponentExampleCodeFromSource(name);

	if (exampleComponentText) {
		// add comment
		exampleComponentText = `<!-- /* Generated from @component example section in "${name}.svelte" */ -->\n${exampleComponentText.replace(
			/'svelte-tweakpane-ui'/,
			"'$lib'"
		)}`;

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
	const exampleComponentText = await getComponentExampleCodeFromSource(name, true);

	if (exampleComponentText) {
		// overwrites existing, creates intermediate directories
		const resolvedPath = path.resolve(`${destination}/${name}${suffix}.svelte`);
		fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });

		const parser = await createMarkdownParser();
		const rendered = parser.render(exampleComponentText);

		let component =
			'<script>\n' +
			"import { CodeFence } from '@svelteness/kit-docs';\n" +
			'</script>\n' +
			`${rendered}\n`;

		// Set some options
		component = component.replace(
			'<CodeFence ',
			`<CodeFence showLineNumbers showCopyCode title="${name}${suffix}.svelte" `
		);

		// component = await format(component, prettierConfig);

		fs.writeFileSync(resolvedPath, component);
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
const componentDestination = './src/lib-docs/generated/examples';
const markdownDestination = './src/lib-docs/generated/markdown';

console.log(`Generating documentation components for ${components.length} components...`);

deleteExisting(componentDestination);
deleteExisting(markdownDestination);

for (const { name } of components) {
	if (await generateExampleComponent(name, 'Example', componentDestination)) {
		totalComponentsGenerated++;
	} else {
		console.warn(`No example code found in "${name}.svelte"`);
	}

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
