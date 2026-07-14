import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	expect: {
		timeout: process.env.CI !== undefined && process.env.CI !== '' ? 20_000 : 5000,
	},
	retries: process.env.CI !== undefined && process.env.CI !== '' ? 2 : 0,
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/v,
	webServer: {
		command: 'vite dev',
		port: 5173,
		reuseExistingServer: true,
	},
}

export default config
