import { cspellConfig } from '@kitschpatrol/cspell-config'

export default cspellConfig({
	ignorePaths: ['./build/**', '**/changelog.md'],
	words: ['chagent', 'onwarn', 'prophoto'],
})
