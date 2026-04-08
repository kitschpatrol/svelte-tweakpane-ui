import type { ComponentType } from 'svelte'

const modules = import.meta.glob<{ default: ComponentType }>('../../examples/**/*.svelte')

export async function load({ data }) {
	// TODO real type...
	const { examples } = data as { examples: string[] }

	const components: Array<{ component: ComponentType; filename: string }> = []

	for (const example of examples) {
		const filename = example.split('/').at(-1)!

		// Find matching module by filename to avoid platform-specific path issues
		const entry = Object.entries(modules).find(([key]) => key.endsWith(`/${filename}`))
		if (!entry) continue

		const { default: component } = await entry[1]()

		components.push({
			component,
			filename,
		})
	}

	return {
		components,
	}
}
