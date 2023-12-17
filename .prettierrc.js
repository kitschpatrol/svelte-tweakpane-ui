import sharedConfig from '@kitschpatrol/prettier-config';

/** @type {import("prettier").Config} */
const localConfig = {
	trailingComma: 'none', // legacy
	semi: true, // legacy
	overrides: [
		...sharedConfig.overrides,
		{
			files: ['*.json', '*.md', '*.mdx', '*.toml', '*.yml'],
			options: {
				useTabs: false
			}
		}
	]
};

export default {
	...sharedConfig,
	...localConfig
};
