import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig(
	{
		astro: true,
		ignores: [
			// Generated kit files
			'src/examples/components/*',
			// Generated doc files
			'docs/src/content/docs/docs/components/*',
			'docs/src/content/acknowledgments/*',
			'docs/src/examples/*',
		],
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
						allowed: ['execa', 'glob', 'fs-extra'],
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
				// TODO delete after next kpi patch
				'unicorn/prevent-abbreviations': 'off',
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
		// TODO fix these code block issues in kpi
		files: ['**/*.{mdx,md,astro}/*.{svelte,ts,js,mts,mjs}'],
		rules: {
			'unicorn/filename-case': 'off',
		},
	},
)

// TODO OLD
// // Overrides for svelte-tweakpane-ui
// // CubicBezier, Quaternion, etc.
// const perfectionistSortOverrides = {
// 	customGroups: {
// 		value: 'value',
// 		x: '@(optionsX|x)',
// 		y: '@(optionsY|y)',
// 		z: '@(optionsZ|z)',
// 		w: '@(optionsW|w)',
// 		h: 'h',
// 		s: 's',
// 		l: 'l',
// 		v: 'v',
// 		r: 'r',
// 		g: 'g',
// 		b: 'b',
// 		a: 'a',
// 		// PreM: '[a-l]*',
// 		min: 'min*',
// 		max: 'max*',
// 		cb1: ['x1', 'y1'],
// 		cb2: ['x2', 'y2']
// 		// Width: 'width',
// 		// height: 'height'
// 		// postM: '[n-z]*'
// 	},
// 	groups: [
// 		'value',
// 		'x',
// 		'y',
// 		'z',
// 		'w',
// 		'h',
// 		's',
// 		'l',
// 		'v',
// 		'r',
// 		'g',
// 		'b',
// 		'a',
// 		'min',
// 		'max',
// 		'cb1',
// 		'cb2',
// 		'unknown'
// 	]
// };

// /* @type {import('eslint').Linter.Config} */
// module.exports = {
// 	extends: ['@kitschpatrol/eslint-config'],
// 	overrides: [
// 		{
// 			files: ['*.mdx'],
// 			rules: {
// 				'link.no-such-reference': 'off' // Starlight note titles
// 			}
// 		},
// 		{
// 			files: ['*.html'],
// 			rules: {
// 				'@html-eslint/no-inline-styles': 'off',
// 				'@html-eslint/require-title': 'off'
// 			}
// 		},
// 		{
// 			files: ['*.svelte'],
// 			rules: {
// 				'ts/ban-types': 'off',
// 				'ts/consistent-type-assertions': 'off',
// 				'ts/dot-notation': 'off',
// 				'ts/no-duplicate-type-constituents': 'off',
// 				'ts/no-redundant-type-constituents': 'off',
// 				'ts/no-unnecessary-type-arguments': 'off',
// 				'ts/restrict-plus-operands': 'off',
// 				'no-return-assign': 'off',
// 				'unicorn/no-null': 'off',
// 				'unicorn/prefer-export-from': 'off'
// 			}
// 		},
// 		{
// 			files: ['FileExample.svelte'],
// 			rules: {
// 				'unicorn/prefer-top-level-await': 'off'
// 			}
// 		},
// 		{
// 			files: ['HomeDemo.svelte', 'TweakpaneDemo.svelte'],
// 			rules: {
// 				// Overzealous Svelte 5 warning...
// 				'svelte/valid-compile': 'off'
// 			}
// 		},
// 		{
// 			files: ['*.astro'],
// 			rules: {
// 				'ts/restrict-template-expressions': 'off'
// 			}
// 		}
// 	],

// 	root: true,

// 	rules: {
// 		'ts/no-inferrable-types': 'off',
// 		'ts/no-unsafe-argument': 'off',
// 		'ts/no-unsafe-assignment': 'off',
// 		'ts/no-unsafe-call': 'off',
// 		'ts/no-unsafe-member-access': 'off',
// 		'ts/no-unsafe-return': 'off',
// 		'n/no-unsupported-features/node-builtins': 'off',
// 		'perfectionist/sort-object-types': ['error', perfectionistSortOverrides],
// 		'perfectionist/sort-objects': ['error', perfectionistSortOverrides],
// 		'perfectionist/sort-svelte-attributes': ['error', perfectionistSvelteSortOverrides]
// 	}
// };
