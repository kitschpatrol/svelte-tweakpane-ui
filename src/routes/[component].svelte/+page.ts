import type { ComponentType } from 'svelte'
import type { PageLoad } from './$types'

const modules = import.meta.glob<{ default: ComponentType }>('../../examples/**/*.svelte')

export const load: PageLoad = async ({ data }) => {
	const { match } = data

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
