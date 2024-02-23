import sharedConfig, { overrideRules } from '@kitschpatrol/remark-config';

const localConfig = {
	...sharedConfig,
	plugins: overrideRules(sharedConfig.plugins, [['remark-lint-first-heading-level', false]])
};

export default localConfig;
