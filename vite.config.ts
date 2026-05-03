import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

process.env.BROWSER = 'chromium'

// SvelteKit 2.56+ runtime references Svelte 5-only exports (hydratable, untrack,
// fork, settled) behind defensive guards. Rollup's static analysis can't see the
// guards and emits MISSING_EXPORT warnings when building against Svelte 4.
const svelte5GuardedExports = new Set(['fork', 'hydratable', 'settled', 'untrack'])

export default defineConfig({
	build: {
		rollupOptions: {
			onwarn(warning, defaultHandler) {
				if (
					warning.code === 'MISSING_EXPORT' &&
					warning.id?.includes('@sveltejs/kit/src/runtime/') &&
					svelte5GuardedExports.has(warning.binding ?? '')
				) {
					return
				}

				defaultHandler(warning)
			},
		},
	},
	plugins: [sveltekit()],
	server: {
		open: true,
	},
})
