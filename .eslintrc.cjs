// Overrides for svelte-tweakpane-ui
// CubicBezier, Quaternion, etc.
const perfectionistSortOverrides = {
	customGroups: {
		value: 'value',
		x: '@(optionsX|x)',
		y: '@(optionsY|y)',
		z: '@(optionsZ|z)',
		w: '@(optionsW|w)',
		h: 'h',
		s: 's',
		l: 'l',
		v: 'v',
		r: 'r',
		g: 'g',
		b: 'b',
		a: 'a',
		// PreM: '[a-l]*',
		min: 'min*',
		max: 'max*',
		cb1: ['x1', 'y1'],
		cb2: ['x2', 'y2']
		// Width: 'width',
		// height: 'height'
		// postM: '[n-z]*'
	},
	groups: [
		'value',
		['x', 'y', 'z'],
		'x',
		'y',
		'z',
		'w',
		'h',
		's',
		'l',
		'v',
		'r',
		'g',
		'b',
		'a',
		'min',
		'max',
		'cb1',
		'cb2',
		'unknown'
	]
};

const perfectionistSvelteSortOverrides = {
	customGroups: {
		value: '?(bind:)value',
		min: '?(bind:)min',
		max: '?(bind:)max',
		'bind-directives': 'bind:*',
		'bind-this': 'bind:this',
		class: '@(class|class:*)',
		'on-directives': 'on:*',
		style: '@(style|style:*)',
		'style-props': '--style-props',
		this: 'this',
		'use-directives': 'use:*'
	},
	groups: [
		'bind-this',
		'value',
		'min',
		'max',
		['bind-directives', 'use-directives', 'on-directives'],
		'this',
		'class',
		'style',
		'style-props',
		'unknown'
	]
};

/* @type {import('eslint').Linter.Config} */
module.exports = {
	extends: ['@kitschpatrol/eslint-config'],
	overrides: [
		{
			files: ['*.mdx'],
			rules: {
				'link.no-such-reference': 'off' // Starlight note titles
			}
		},
		{
			files: ['*.html'],
			rules: {
				'@html-eslint/no-inline-styles': 'off',
				'@html-eslint/require-title': 'off'
			}
		},
		{
			files: ['*.svelte'],
			rules: {
				'@typescript-eslint/ban-types': 'off',
				'@typescript-eslint/consistent-type-assertions': 'off',
				'@typescript-eslint/dot-notation': 'off',
				'@typescript-eslint/no-duplicate-type-constituents': 'off',
				'@typescript-eslint/no-redundant-type-constituents': 'off',
				'@typescript-eslint/no-unnecessary-type-arguments': 'off',
				'@typescript-eslint/restrict-plus-operands': 'off',
				'no-return-assign': 'off',
				'unicorn/no-null': 'off',
				'unicorn/prefer-export-from': 'off'
			}
		},
		{
			files: ['*.astro'],
			rules: {
				'@typescript-eslint/restrict-template-expressions': 'off'
			}
		}
	],

	root: true,

	rules: {
		'@typescript-eslint/no-inferrable-types': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'n/no-unsupported-features/node-builtins': 'off',
		'perfectionist/sort-object-types': ['error', perfectionistSortOverrides],
		'perfectionist/sort-objects': ['error', perfectionistSortOverrides],
		'perfectionist/sort-svelte-attributes': ['error', perfectionistSvelteSortOverrides]
	}
};
