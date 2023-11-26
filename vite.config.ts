import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

process.env.BROWSER = 'chromium';

export default defineConfig({
	plugins: [sveltekit()],
	// ssr: {
	// 	noExternal: ['svelte-tweakpane-ui']
	// },
	server: {
		open: true
	}
});
