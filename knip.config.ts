import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	entry: ['src/examples/**/*.svelte', 'docs/src/middleware/index.ts', 'tests/**/*.ts'],
	ignore: ['docs/src/components/**/*.{astro,mdx}', 'docs/src/middleware/*.ts'],
	ignoreDependencies: [
		'@prettier/plugin-php',
		'@prettier/plugin-ruby',
		'@prettier/plugin-xml',
		'@stkb/rewrap',
		'@types/eslint',
		'linkedom',
		'postcss-html',
		'prettier-plugin-packagejson',
		'prettier-plugin-sh',
		'prettier-plugin-sql',
		'prettier-plugin-tailwindcss',
		'prettier-plugin-toml',
		'sharp',
		'svelte-tweakpane-ui',
		'tslib',
	],
	rules: {
		exports: 'off',
		types: 'off',
	},
})
