import type { ComponentType } from 'svelte'

export async function load({ data }) {
	const { match } = data

	const filename = match.split('/').at(-1)
	const folder = match.split('/').slice(2, -1).join('/')
	const componentName = filename?.split('.').slice(0, -1).join('.')

	const { default: component }: { default: ComponentType } = await import(
		`../../examples/${folder}/${componentName}.svelte`
	)

	return {
		component,
		filename,
	}
}
