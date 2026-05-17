import type { ComponentType } from 'svelte'

const modules = import.meta.glob<{ default: ComponentType }>('../../examples/**/*.svelte')

export async function load({ data }) {
	// TODO real type...
	const { match } = data as { match: string }

	const filename = match.split('/').at(-1)

	// Find matching module by filename to avoid platform-specific path issues
	const entry = Object.entries(modules).find(([key]) => key.endsWith(`/${filename}`))
	if (!entry) {
		throw new Error(`Component not found: ${filename}`)
	}

	const { default: component } = await entry[1]()

	return {
		component,
		filename,
	}
}
