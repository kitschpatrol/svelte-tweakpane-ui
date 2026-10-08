import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	entry: ['src/examples/**/*.svelte', 'tests/**/*.ts'],
	ignoreDependencies: ['canvas', '@sveltejs/package', 'postcss-html', 'publint', 'tslib', 'mdat'],
})
