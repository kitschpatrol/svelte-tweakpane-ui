import fs from 'node:fs'
// Extracts and saves example blocks from component jsdoc,
import {
	getComponentExampleCodeFromSource,
	getExportedComponents,
	lintAndFormat,
} from './ast-tools'

const components = getExportedComponents('./src/lib/index.ts')

fs.mkdirSync('./src/examples/components', { recursive: true })

for (const { name } of components) {
	const code = await getComponentExampleCodeFromSource(name, false)
	if (code) {
		// Format _again_ because the import name change can mess up perfectionist's sort order
		fs.writeFileSync(
			`./src/examples/components/${name}Example.svelte`,
			await lintAndFormat(code.replace(/'svelte-tweakpane-ui/, "'$lib")),
		)
	}
}
