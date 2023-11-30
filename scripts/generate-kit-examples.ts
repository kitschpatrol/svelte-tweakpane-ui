import {
	getComponentExampleCodeFromSource,
	getExportedComponents,
	lintAndFormat
} from './ast-tools';
import fs from 'fs';

const components = getExportedComponents('./src/lib/index.ts');

fs.mkdirSync('./src/examples/components', { recursive: true });

for (const { name } of components) {
	const code = await getComponentExampleCodeFromSource(name, false);
	if (code) {
		fs.writeFileSync(
			`./src/examples/components/${name}Example.svelte`,
			await lintAndFormat(code.replace(/'svelte-tweakpane-ui/, "'$lib"))
		);
	}
}
