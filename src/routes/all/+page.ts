import type { ComponentType } from 'svelte'

export async function load({ data }) {
	// TODO real type...
	const { examples } = data as { examples: string[] }

	const components: Array<{ component: ComponentType; filename: string }> = []

	for (const example of examples) {
		const filename = example.split('/').at(-1)!
		const folder = example.split('/').slice(2, -1).join('/')
		const componentName = filename.split('.').slice(0, -1).join('.')

		const { default: component } = (await import(
			`../../examples/${folder}/${componentName}.svelte`
		)) as { default: ComponentType }

		components.push({
			component,
			filename,
		})
	}

	return {
		components,
	}
}
