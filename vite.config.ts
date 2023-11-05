import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import icons from 'unplugin-icons/vite';
import kitDocs from '@svelteness/kit-docs/node';

process.env.BROWSER = 'google chrome';

export default defineConfig({
	plugins: [icons({ compiler: 'svelte' }), kitDocs(), sveltekit()],

	// ssr: {
	// 	noExternal: ['svelte-tweakpane-ui']
	// },

	server: {
		watch: {
			usePolling: true
		},

		open: true
		// HMR is a mess with Kit Docs
		// hmr: false
	}
	// build: {
	// 	target: 'es6'
	// }
});
