import type { ComponentType } from 'svelte'

export async function load({ data }) {
	// TODO real type...
	const { match } = data as { match: string }

	const filename = match.split('/').at(-1)
	const folder = match.split('/').slice(2, -1).join('/')
	const componentName = filename?.split('.').slice(0, -1).join('.')

	const { default: component }: { default: ComponentType } = (await import(
		`../../examples/${folder}/${componentName}.svelte`
	)) as { default: ComponentType }

	return {
		component,
		filename,
	}
}
