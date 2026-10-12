import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { fileURLToPath } from 'node:url'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// @sveltejs/package 3 reads aliases from the root of the config (the SvelteKit 3 shape) and
	// ignores `kit.alias` and `kit.files.lib`, so `$lib` must be declared here while on SvelteKit 2
	alias: {
		$lib: fileURLToPath(new URL('src/lib', import.meta.url)),
	},
	compilerOptions: {
		preserveComments: false,
		preserveWhitespace: false,
	},
	extensions: ['.svelte'],
	kit: {
		adapter: adapter(),
	},
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
}

export default config
