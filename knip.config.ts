import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	entry: ['src/examples/**/*.svelte', 'docs/src/middleware/index.ts', 'tests/**/*.ts'],
	ignore: ['docs/src/components/**/*.{astro,mdx}', 'docs/src/middleware/*.ts'],
	ignoreBinaries: ['open'],
	ignoreDependencies: [
		'@stkb/rewrap',
		'@types/eslint',
		'linkedom',
		'mdat',
		'node-addon-api',
		'node-gyp',
		'postcss-html',
		'sharp',
		'tslib',
	],
	rules: {
		exports: 'off',
		types: 'off',
	},
})
