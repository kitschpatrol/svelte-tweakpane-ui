import type { Rules } from '@kitschpatrol/eslint-config'
import { eslintConfig, generatePerfectionistSortConfig } from '@kitschpatrol/eslint-config'

/**
 * This completely overrides the defaults provided in \@kitschpatrol/shared-config
 * It is clunky and duplicative, but is the only way to ensure consistent
 * sorting of props across both the source code and documentation.
 */
const perfectionistSortConfig = [
	['min', 'max'],
	['min', 'max', 'begin', 'end', 'interval', 'label', 'rows'],
	['r', 'g', 'b'],
	['r', 'g', 'b', 'a'],
	['value', 'amount'],
	['value', 'columns', 'groupName', 'prefix', 'rows', 'suffix', 'values'],
	['value', 'extensions', 'fit'],
	['value', 'extensions', 'invalidExtensionMessage', 'rows'],
	['value', 'label'],
	['value', 'label', 'options'],
	['value', 'live'],
	['value', 'live', 'placeholder', 'rows'],
	['value', 'meanValue'],
	['value', 'min', 'max', 'lineStyle'],
	['value', 'min', 'max', 'format', 'graph'],
	['value', 'min', 'max', 'format', 'keyScale', 'pointerScale', 'step'],
	['value', 'multiline'],
	['value', 'optionsX', 'optionsY', 'optionsZ', 'order', 'unit'],
	['value', 'optionsX', 'optionsY', 'optionsZ', 'optionsW'],
	['value', 'origin'],
	['value', 'pixels', 'ticks'],
	['value', 'series', 'unit'],
	['value', 'text'],
	['value', 'title'],
	['value', 'type'],
	['x', 'y', 'width', 'expanded'],
	[
		'x',
		'y',
		'width',
		'minWidth',
		'maxWidth',
		'resizable',
		'padding',
		'collapseChildrenToFit',
		'storePositionLocally',
		'localStoreId',
	],
	['x', 'y', 'z', 'w'],
	['x1', 'y1', 'x2', 'y2'],
].map((element) => generatePerfectionistSortConfig(element))

/**
 * These rules are used in both TypeScript and Svelte files.
 */
const sharedOverrides: Rules = {
	'perfectionist/sort-object-types': [
		'error',
		...perfectionistSortConfig,
		{ newlinesBetween: 0, order: 'asc', type: 'natural' },
	],
	'perfectionist/sort-objects': [
		'error',
		...perfectionistSortConfig,
		{ newlinesBetween: 0, order: 'asc', type: 'natural' },
	],
	'ts/no-inferrable-types': 'off',
	'ts/no-unsafe-type-assertion': 'off',
	'unicorn/no-array-reduce': 'off',
}

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
			// Virtual Svelte files from markdown code blocks (not in tsconfig
			// project)
			'**/*.md/*.svelte',
			'**/*.mdx/*.svelte',
			'**/*.mdx/*.js',
		],
		js: {
			overrides: {
				'import/no-unresolved': 'off',
			},
			// // Issues with code blocks in MDX files not appearing in tsconfig
			// // project
			// typeAware: {
			// 	enabled: true,
			// 	ignores: ['**/*.mdx/*.js'],
			// },
		},
		svelte: {
			overrides: {
				'import/consistent-type-specifier-style': 'off',
				'jsdoc/check-tag-names': 'off',
				'jsdoc/valid-types': 'off',
				'no-self-assign': 'off',
				'node/no-unsupported-features/node-builtins': 'off',
				'svelte/no-navigation-without-resolve': 'off',
				'svelte/no-reactive-reassign': 'off',
				'svelte/require-each-key': 'off',
				// TODO see Binding.svelte... was this a mistake?
				'svelte/require-store-reactive-access': 'off',
				'ts/consistent-type-assertions': 'off',
				'ts/dot-notation': 'off',
				// Oh no...
				'ts/no-empty-object-type': 'off',
				'ts/no-explicit-any': 'off',
				'ts/no-redundant-type-constituents': 'off',
				'ts/no-unnecessary-condition': 'off',
				'ts/no-unsafe-argument': 'off',
				'ts/no-unsafe-assignment': 'off',
				'ts/no-unsafe-call': 'off',
				'ts/no-unsafe-member-access': 'off',
				'ts/no-unsafe-return': 'off',
				'ts/no-unused-vars': [
					'error',
					{
						varsIgnorePattern: String.raw`^\$\$|^_`,
					},
				],
				'unicorn/no-null': 'off',
				...sharedOverrides,
			},
		},
		ts: {
			overrides: {
				'depend/ban-dependencies': [
					'error',
					{
						allowed: ['execa', 'glob', 'read-package-up'],
					},
				],
				'import/no-named-as-default-member': 'off',
				'jsdoc/require-jsdoc': 'off',
				...sharedOverrides,
			},
		},
		type: 'lib',
	},
	{
		files: ['docs/package.json'],
		rules: {
			'json-package/require-keywords': 'off',
			// Because of link to parent
			'json-package/valid-dependencies': 'off',
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
