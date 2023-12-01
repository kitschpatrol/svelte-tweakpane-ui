// extracts and saves example blocks from component jsdocs,

import { getComponentExampleCodeFromSource, getExportedComponents } from './ast-tools';
import fs from 'fs';

const components = getExportedComponents('./src/lib/index.ts');

fs.mkdirSync('./src/examples/components', { recursive: true });

for (const { name } of components) {
	const code = await getComponentExampleCodeFromSource(name, false);
	if (code) {
		fs.writeFileSync(
			`./src/examples/components/${name}Example.svelte`,
			code.replace(/'svelte-tweakpane-ui/, "'$lib")
		);
	}
}
