import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	entry: ['tests/**/*.ts'],
	ignoreDependencies: [
		'canvas',
		'@sveltejs/package',
		'postcss-html',
		'publint',
		'tslib',
		'mdat',
		'@kitschpatrol/chagent', // Typically invoked through bumpp's --execute argument, which Knip doesn't parse
	],
})
