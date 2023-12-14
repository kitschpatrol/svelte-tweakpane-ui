import sharedConfig, { overrideRules } from '@kitschpatrol/remark-config';

const localConfig = {
	...sharedConfig,
	plugins: overrideRules(sharedConfig.plugins, [
		['remark-lint-first-heading-level', false],
		['remark-lint-no-emphasis-as-heading', false],
		['remark-lint-no-missing-blank-lines', false]
	])
};

export default localConfig;
