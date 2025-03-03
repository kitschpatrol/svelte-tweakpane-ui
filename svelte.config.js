import adapter from '@sveltejs/adapter-static'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
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
