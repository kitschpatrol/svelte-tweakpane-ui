// Generate basic component documentation for the readme.md file via a
// custom mdat rule

// import type { Rules } from 'remark-mdat';
import { getExportedComponents } from './ast-tools'
import { getComponentInfo } from './component-info'

const mdatComponentRules = {
	'component-count': String(getExportedComponents('./src/lib/index.ts').length),
	'component-list': {
		async content() {
			const components = getExportedComponents('./src/lib/index.ts')

			const sections = new Map<string, string[]>()

			for (const component of components) {
				const { name, path } = component

				const resolvePath = path.replace('$lib', './src/lib')
				const componentInfo = await getComponentInfo(resolvePath)

				if (componentInfo === undefined) {
					continue
				}

				const sectionName = componentInfo.pathParts[0]
				const output = sections.get(sectionName) ?? []

				const firstLineOfDocumentation = componentInfo.doc.split('\n\n')[0].replaceAll('\n', ' ')

				output.push(
					`- **[${name}](https://kitschpatrol.com/svelte-tweakpane-ui/docs/components/${name.toLowerCase()})**  `,
					`  ${firstLineOfDocumentation}`,
				)

				sections.set(sectionName, output)
			}

			const finalOutput: string[] = []
			for (const sectionName of ['core', 'control', 'monitor', 'extra']) {
				finalOutput.push(`### ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`)

				const section = sections.get(sectionName) ?? []
				for (const line of section) {
					finalOutput.push(line)
				}
			}

			return finalOutput.join('\n')
		},
	},
} // Not working in this context: `satisfies Rules;`

export default mdatComponentRules
