import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		preserveComments: false,
		preserveWhitespace: false
		// dev: true
	},
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	extensions: ['.svelte', '.md'],
	kit: {
		adapter: adapter(),
		alias: {
			'$lib-docs': './src/lib-docs'
		},
		paths: { base: '/svelte-tweakpane-ui' }
	},
	// for more information about preprocessors
	preprocess: vitePreprocess()
};

export default config;
