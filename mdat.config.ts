import { mdatConfig } from '@kitschpatrol/mdat-config'
import mdatComponentRules from './scripts/mdat-component-rules'

export default mdatConfig({
	rules: {
		...mdatComponentRules,
	},
})
