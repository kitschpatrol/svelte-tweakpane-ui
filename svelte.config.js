import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	ssr: {
		noExternal: ['three']
	},
	kit: {
		adapter: adapter(),
		alias: {
			'$lib-docs': './src/lib-docs'
		}
	},
	compilerOptions: {
		preserveWhitespace: false,
		preserveComments: false
		// dev: true
	}
};

export default config;
