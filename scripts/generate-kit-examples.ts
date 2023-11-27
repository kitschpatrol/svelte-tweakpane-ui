import { getComponentExampleCodeFromSource, getExportedComponents } from './ast-tools';
import fs from 'fs';

const components = getExportedComponents('./src/lib/index.ts');

fs.mkdirSync('./src/routes/all-examples/examples', { recursive: true });

for (const { name } of components) {
	const code = await getComponentExampleCodeFromSource(name, false);
	if (code) {
		fs.writeFileSync(
			`./src/routes/all-examples/examples/${name}.svelte`,
			code.replace(/'svelte-tweakpane-ui/, "'$lib")
		);
	}
}
