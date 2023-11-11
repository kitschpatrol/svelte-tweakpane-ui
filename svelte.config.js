import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		preserveComments: false,
		preserveWhitespace: false
		// dev: true
	},
	extensions: ['.svelte'],
	kit: {
		adapter: adapter()
		// paths: { base: '/svelte-tweakpane-ui' }
	},
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess()
};

export default config;
