import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	expect: {
		timeout: process.env.CI === undefined || process.env.CI === '' ? 5000 : 20_000,
	},
	retries: process.env.CI === undefined || process.env.CI === '' ? 0 : 2,
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/v,
	webServer: {
		command: 'vite dev',
		port: 5173,
		reuseExistingServer: true,
	},
}

export default config
