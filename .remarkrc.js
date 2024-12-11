import sharedConfig, { overrideRules } from '@kitschpatrol/remark-config';

const localConfig = {
	...sharedConfig,
	plugins: overrideRules(sharedConfig.plugins, [
		['remark-lint-first-heading-level', false],
		['remarkValidateLinks', false]
		// TODO sort out missing-heading false positives issue...
		// [
		// 	'remarkValidateLinks',
		// 	{
		// 		urlConfig: {
		// 			path: '/svelte-tweakpane-ui/'
		// 		}
		// 	}
		// ]
	])
};

export default localConfig;
