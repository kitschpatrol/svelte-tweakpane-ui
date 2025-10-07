import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig(
	{
		astro: {
			overrides: {
				'ts/no-unsafe-type-assertion': 'off',
			},
		},
		ignores: [
			// Generated kit files
			'src/examples/components/*',
			// Generated doc files
			'docs/src/content/docs/docs/components/*',
			'docs/src/content/acknowledgments/*',
			'docs/src/examples/*',
		],
		js: {
			overrides: {
				'import/no-unresolved': 'off',
			},
			// Issues with code blocks in MDX files not appearing in tsconfig
			// project
			typeAware: {
				enabled: true,
				ignores: ['**/*.mdx/*.js'],
			},
		},
		svelte: {
			overrides: {
				// Oh no...
				'svelte/no-reactive-reassign': 'off',
				'svelte/require-each-key': 'off',
			},
		},
		ts: {
			overrides: {
				'depend/ban-dependencies': [
					'error',
					{
						allowed: ['execa', 'glob', 'fs-extra', 'read-package-up'],
					},
				],
				'import/no-named-as-default-member': 'off',
				'jsdoc/require-jsdoc': 'off',
				// TODO is this the default? Include in KPI?
				// 'ts/no-base-to-string': [
				// 	'error',
				// 	{ ignoredTypeNames: ['Error', 'RegExp', 'URL', 'URLSearchParams'] },
				// ],
				'ts/no-inferrable-types': 'off',
				'ts/no-unsafe-type-assertion': 'off',
			},
		},
		type: 'lib',
	},
	{
		files: ['docs/package.json'],
		rules: {
			'json-package/require-keywords': 'off',
			// Because of link to parent
			'json-package/valid-package-definition': 'off',
		},
	},
	{
		files: ['**/*.{mdx,md,astro}/*.{svelte,ts,js,mts,mjs}'],
		rules: {
			'unicorn/filename-case': 'off',
		},
	},
)
