import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	entry: ['src/examples/**/*.svelte', 'docs/src/middleware/index.ts', 'tests/**/*.ts'],
	ignore: ['docs/src/components/**/*.{astro,mdx}'],
	ignoreDependencies: [
		'sharp',
		'svelte-tweakpane-ui',
		'@stkb/rewrap',
		'@types/eslint',
		'postcss-html',
		'tslib',
		'@prettier/plugin-php',
		'@prettier/plugin-ruby',
		'@prettier/plugin-xml',
		'prettier-plugin-packagejson',
		'prettier-plugin-sh',
		'prettier-plugin-sql',
		'prettier-plugin-tailwindcss',
		'prettier-plugin-toml',
	],
	rules: {
		exports: 'off',
		types: 'off',
	},
})
