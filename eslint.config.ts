import type { Rules } from '@kitschpatrol/eslint-config'
import { eslintConfig, generatePerfectionistSortConfig } from '@kitschpatrol/eslint-config'

/**
 * This completely overrides the defaults provided in
 * `@kitschpatrol/shared-config` It is clunky and duplicative, but is the only
 * way to ensure consistent sorting of props across both the source code and
 * documentation.
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
	'e18e/prefer-array-fill': 'off', // Messes with types
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
	'unicorn/no-array-reduce': 'off',
	'unicorn/prefer-dom-node-html-methods': 'off',
}

export default eslintConfig({
	astro: {
		overrides: {
			'ts/no-unsafe-return': 'off',
		},
	},
	ignores: [
		'src/examples/components/*', // Generated kit files, error free but redundant
		'docs/src/content/docs/docs/components/*', // Generated doc files, error free but redundant
		'docs/src/content/acknowledgments/*', // Generated doc files, error free but redundant
		'docs/src/examples/*', // Generated doc files, error free but redundant
		'**/*.md/*.svelte', // Virtual Svelte files in MD code blocks (not in tsconfig)
		'**/*.mdx/*.{svelte,js}', // Virtual Svelte files in MD code blocks (not in tsconfig)
	],
	svelte: {
		overrides: {
			'import/consistent-type-specifier-style': 'off',
			'jsdoc/check-tag-names': 'off',
			'jsdoc/valid-types': 'off',
			'no-self-assign': 'off',
			'node/no-unsupported-features/node-builtins': 'off',
			'require-unicode-regexp': ['error', { requireFlag: 'u' }], // The Svelte 4 compiler can't parse the 'v' flag, so require 'u' instead
			'svelte/experimental-require-strict-events': 'off', // Svelte 5 warns that the Svelte 4 strictEvents attribute is unrecognized
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/no-reactive-reassign': 'off',
			'svelte/no-unused-class-name': [
				'error',
				{
					allowedClassNames: [
						'skip-element-index', // Needed in Element.svelte
					],
				},
			],
			'svelte/require-each-key': 'off',
			'svelte/require-store-reactive-access': 'off', // See Binding.svelte... was this a mistake?
			'svelte/require-stores-init': 'off', // Revisit when confident nothing dependent on detecting uninitialized stores
			'ts/consistent-type-assertions': 'off',
			'ts/dot-notation': 'off',
			'ts/no-deprecated': [
				'error',
				{
					allow: [
						{
							from: 'package',
							name: 'createEventDispatcher',
							package: 'svelte',
						},
						{
							from: 'package',
							name: 'beforeUpdate',
							package: 'svelte',
						},
					],
				},
			],
			'ts/no-empty-object-type': 'off', // Oh no...
			'ts/no-explicit-any': 'off', // Oh no...
			'ts/no-redundant-type-constituents': 'off', // Oh no...
			'ts/no-unnecessary-condition': 'off', // Oh no...
			'ts/no-unsafe-argument': 'off', // Oh no...
			'ts/no-unsafe-assignment': 'off', // Oh no...
			'ts/no-unsafe-call': 'off', // Oh no...
			'ts/no-unsafe-member-access': 'off', // Oh no...
			'ts/no-unsafe-return': 'off', // Oh no...
			'ts/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: String.raw`^\$\$|^_`,
				},
			],
			'unicorn/no-null': 'off',
			'unicorn/no-optional-chaining-on-undeclared-variable': 'off', // False positives on Svelte's compiler-declared `$store` auto-subscription variables
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
			'jsdoc/require-jsdoc': 'off',
			...sharedOverrides,
		},
	},
	type: 'lib',
})
