import fs from 'fs';
import { getExportedComponents } from './ast-tools';

// Inspired by https://github.com/shinokada/svelte-lib-helpers

const verbose = false;

type Export = { types: string; svelte: string };
type Exports = Record<string, Export>;

// gets all props for a given component from its definition file
function addExports(sourceIndexFile: string, destinationPackageFile: string) {
	console.log(`Adding Svelte components found in ${sourceIndexFile} to ${destinationPackageFile}`);

	// default export
	const exports: Exports = {
		'.': {
			types: './dist/index.d.ts',
			svelte: './dist/index.js'
		}
	};

	// extract from index file
	getExportedComponents(sourceIndexFile).forEach((component) => {
		const { name, path } = component;

		const key = `./${name}.svelte`;
		const types = `./dist/${path.replace('./', '')}.d.ts`;
		const svelte = `./dist/${path.replace('./', '')}`;
		exports[key] = { types, svelte };

		verbose && console.log(exports[key]);
	});

	// save to package.json
	const packageJson = JSON.parse(fs.readFileSync(destinationPackageFile, 'utf-8'));
	packageJson.exports = exports;
	packageJson.types = './dist/index.d.ts';

	// deprecated, astro complains
	// https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#conflicts-in-svelte-resolve
	// packageJson.svelte = './dist/index.d.ts';

	fs.writeFileSync(destinationPackageFile, JSON.stringify(packageJson, null, 2));

	console.log(
		`Done. Wrote 'types' and ${
			Object.keys(exports).length - 1
		} component 'exports' values to ${destinationPackageFile}.`
	);
}

addExports('./src/lib/index.ts', './package.json');
