import type { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	testDir: 'tests',
	testMatch: /(.+\.)?(test|spec)\.[jt]s/,
	webServer: {
		command: 'vite dev',
		port: 5173,
	},
}

export default config
