import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

process.env.BROWSER = 'google chrome';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		open: true
	}
	// build: {
	// 	target: 'es6'
	// }
});
