import { remarkConfig } from '@kitschpatrol/remark-config'

export default remarkConfig({
	rules: [
		['remark-lint-first-heading-level', false],
		['remarkValidateLinks', false],
	],
})
