import { getExportedComponents, getExportedJs } from './ast-tools';
import fs from 'node:fs';

// Inspired by https://github.com/shinokada/svelte-lib-helpers

const verbose = false;

type Export = { default?: string; svelte?: string; types: string };
type Exports = Record<string, Export>;

// gets all props for a given component from its definition file
function addExports(sourceIndexFile: string, destinationPackageFile: string) {
	console.log(`Adding Svelte components found in ${sourceIndexFile} to ${destinationPackageFile}`);

	// default export
	const exports: Exports = {
		'.': {
			types: './dist/index.d.ts',
			// eslint-disable-next-line perfectionist/sort-objects
			svelte: './dist/index.js'
		}
	};

	// extract components from index file
	for (const component of getExportedComponents(sourceIndexFile)) {
		const { name, path } = component;

		const key = `./${name}.svelte`;
		const types = `./dist/${path.replace('$lib/', '')}.d.ts`;
		const svelte = `./dist/${path.replace('$lib/', '')}`;
		// eslint-disable-next-line perfectionist/sort-objects
		exports[key] = { types, svelte };

		verbose && console.log(exports[key]);
	}

	// extract JS exports from index file (like Utils, etc.)
	for (const file of getExportedJs(sourceIndexFile)) {
		const { name, path } = file;

		const key = `./${name}.js`;
		const types = `./dist/${path.replace('.js', '').replace('$lib/', '')}.d.ts`;
		const defaultValue = `./dist/${path.replace('$lib/', '')}`;
		// eslint-disable-next-line perfectionist/sort-objects
		exports[key] = { types, default: defaultValue };

		verbose && console.log(exports[key]);
	}

	// save to package.json
	const packageJson = JSON.parse(fs.readFileSync(destinationPackageFile, 'utf8'));
	packageJson.exports = exports;
	packageJson.types = './dist/index.d.ts';

	// Deprecated, Astro complains
	// https://github.com/sveltejs/vite-plugin-svelte/blob/main/docs/faq.md#conflicts-in-svelte-resolve
	// packageJson.svelte = './dist/index.d.ts';

	fs.writeFileSync(destinationPackageFile, JSON.stringify(packageJson, undefined, 2));

	console.log(
		`Done. Wrote 'types' and ${
			Object.keys(exports).length - 1
		} component 'exports' values to ${destinationPackageFile}.`
	);
}

addExports('./src/lib/index.ts', './package.json');
