import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	expect: {
		timeout: process.env.CI !== undefined && process.env.CI !== '' ? 20_000 : 5000,
	},
	retries: process.env.CI !== undefined && process.env.CI !== '' ? 2 : 0,
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/v,
	use: {
		baseURL: 'http://127.0.0.1:4173',
	},
	webServer: {
		// Keep tests separate from other projects using Vite's default dev port.
		command: 'vite dev --host 127.0.0.1 --port 4173 --strictPort',
		// eslint-disable-next-line ts/naming-convention -- Vite's environment variable is uppercase.
		env: { BROWSER: 'none' },
		reuseExistingServer: false,
		url: 'http://127.0.0.1:4173',
	},
}

export default config
