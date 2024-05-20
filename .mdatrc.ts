import mdatConfig from '@kitschpatrol/mdat-config';
import mdatComponentRules from './scripts/mdat-component-rules';
import { mergeConfigs } from 'mdat';

export default mergeConfigs(mdatConfig, {
	rules: {
		...mdatComponentRules
	}
});
