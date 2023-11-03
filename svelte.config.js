import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'$lib-docs': './src/lib-docs'
		},
		paths: { base: '/svelte-tweakpane-ui' }
	},
	compilerOptions: {
		preserveWhitespace: false,
		preserveComments: false
		// dev: true
	}
};

export default config;
