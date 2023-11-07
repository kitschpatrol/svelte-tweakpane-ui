import { sveltekit } from '@sveltejs/kit/vite';
import kitDocs from '@svelteness/kit-docs/node';
import icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';

process.env.BROWSER = 'google chrome';

export default defineConfig({
	plugins: [icons({ compiler: 'svelte' }), kitDocs(), sveltekit()],

	// ssr: {
	// 	noExternal: ['svelte-tweakpane-ui']
	// },

	server: {
		open: true,

		watch: {
			usePolling: true
		}
		// HMR is a mess with Kit Docs
		// hmr: false
	}
	// build: {
	// 	target: 'es6'
	// }
});
