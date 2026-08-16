import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	entry: ['src/examples/**/*.svelte', 'docs/src/middleware/index.ts', 'tests/**/*.ts'],
	ignoreDependencies: [
		'@astrojs/check',
		'canvas',
		'svelte-check',
		'@sveltejs/package',
		'postcss-html',
		'publint',
		'svelte-check',
		'tslib',
		'mdat',
	],
})
