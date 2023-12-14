import sharedConfig from '@kitschpatrol/prettier-config';

/** @type {import("prettier").Config} */
const localConfig = {
	trailingComma: 'none', // legacy
	printWidth: 100, // legacy
	overrides: [
		...sharedConfig.overrides,
		{
			files: ['*.json', '*.md', '*.mdx', '*.toml', '*.yml'],
			options: {
				useTabs: false
			}
		},
		{
			files: ['*.sh'],
			options: {
				parser: 'sh',
				plugins: ['prettier-plugin-sh']
			}
		}
	]
};

export default {
	...sharedConfig,
	...localConfig
};
