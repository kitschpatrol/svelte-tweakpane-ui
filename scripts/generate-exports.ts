import { Project } from 'ts-morph';
import ts from 'typescript';
import fs from 'fs';

// Inspired by https://github.com/shinokada/svelte-lib-helpers

const verbose = false;

type Export = { types: string; svelte: string };
type Exports = Record<string, Export>;

// gets all props for a given component from its definition file
function addExports(sourceIndexFile: string, destinationPackageFile: string) {
	console.log(`Adding Svelte components found in ${sourceIndexFile} to ${destinationPackageFile}`);
	const project = new Project();
	const sourceFile = project.addSourceFileAtPath(sourceIndexFile);

	// default export
	const exports: Exports = {
		'.': {
			types: './dist/index.d.ts',
			svelte: './dist/index.js'
		}
	};

	// extract from index file
	sourceFile.getDescendantsOfKind(ts.SyntaxKind.ExportDeclaration).forEach((node) => {
		const path = node.getFirstChildByKind(ts.SyntaxKind.StringLiteral)?.getLiteralText();

		if (path !== undefined && path.endsWith('.svelte')) {
			const name = node
				.getFirstDescendantByKind(ts.SyntaxKind.ExportSpecifier)
				?.getLastChildByKind(ts.SyntaxKind.Identifier)
				?.getText();

			if (name !== undefined) {
				const key = `./${name}.svelte`;
				const types = `./dist/${path.replace('./', '')}.d.ts`;
				const svelte = `./dist/${path.replace('./', '')}`;
				exports[key] = { types, svelte };

				verbose && console.log(exports[key]);
			}
		}
	});

	// save to package.json
	const packageJson = JSON.parse(fs.readFileSync(destinationPackageFile, 'utf-8'));
	packageJson.exports = exports;
	packageJson.types = './dist/index.d.ts';
	packageJson.svelte = './dist/index.d.ts'; // TODO right thing?

	fs.writeFileSync(destinationPackageFile, JSON.stringify(packageJson, null, 2));

	console.log(
		`Done. Wrote 'types', 'svelte', and ${
			Object.keys(exports).length - 1
		} component 'exports' values to ${destinationPackageFile}.`
	);
}

addExports('./dist/index.js', './package.json');
