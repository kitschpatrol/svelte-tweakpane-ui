import type { Plugin, Rollup } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

// SvelteKit 2.56+ runtime references Svelte 5-only exports (hydratable, untrack,
// fork, settled) behind defensive guards. Rollup's static analysis can't see the
// guards and emits MISSING_EXPORT warnings when building against Svelte 4.
const svelte5GuardedExports = new Set(['fork', 'hydratable', 'settled', 'untrack'])

// SvelteKit's plugin sets its own `rollupOptions.onwarn`, which replaces one
// defined in this config on merge, so the filter must be applied from a `post`
// plugin that wraps whatever handler is present after SvelteKit's config hook.
function silenceSvelte5MissingExportWarnings(): Plugin {
	return {
		config(config) {
			const previousOnwarn = config.build?.rollupOptions?.onwarn
			config.build ??= {}
			config.build.rollupOptions ??= {}
			config.build.rollupOptions.onwarn = (
				warning: Rollup.RollupLog,
				defaultHandler: Rollup.LoggingFunction,
			) => {
				if (
					warning.code === 'MISSING_EXPORT' &&
					warning.id?.includes('@sveltejs/kit/src/runtime/') &&
					svelte5GuardedExports.has(warning.binding ?? '')
				) {
					return
				}

				if (previousOnwarn) {
					previousOnwarn(warning, defaultHandler)
				} else {
					defaultHandler(warning)
				}
			}
		},
		enforce: 'post',
		name: 'silence-svelte-5-missing-export-warnings',
	}
}

export default defineConfig({
	plugins: [sveltekit(), silenceSvelte5MissingExportWarnings()],
	server: {
		open: true,
	},
})
