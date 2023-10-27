import { getExportedComponents, getComponentExampleCode } from './ast-tools';
import fs from 'fs';
import path from 'path';

// fishes out all the @example sections of the component source files,
// and writes out a svelte component for each

// returns true on success
function generateExampleComponent(name: string, suffix: string, destination: string): boolean {
	let exampleComponentText = getComponentExampleCode(name);

	if (exampleComponentText) {
		// add comment
		exampleComponentText = `<!-- /* Generated from @component example section in "${name}.svelte" */ -->\n${exampleComponentText}`;

		// overwrites existing, creates intermediate directories
		const resolvedPath = path.resolve(`${destination}/${name}${suffix}.svelte`);
		fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
		fs.writeFileSync(resolvedPath, exampleComponentText);
		return true;
	} else {
		return false;
	}
}

// main
let totalComponentsGenerated = 0;

const components = getExportedComponents('./src/lib/index.ts');
const destination = './src/lib-docs/example-components';

console.log(`Generating documentation components for ${components.length} components...`);

if (fs.existsSync(destination)) {
	console.log(`Removing existing sample components at "${destination}"...`);
	fs.rmSync(destination, { recursive: true });
}

components.forEach(({ name }) => {
	if (generateExampleComponent(name, 'Example', destination)) {
		totalComponentsGenerated++;
	} else {
		console.warn(`No example code found in "${name}.svelte"`);
	}
});

console.log(
	`Done. Found and created ${totalComponentsGenerated} example components in "${destination}" .`
);
