/* eslint-disable perfectionist/sort-objects */

// Overrides for svelte-tweakpane-ui
// CubicBezier, Quaternion, etc.
const perfectionistSortOverrides = {
  'custom-groups': {
    value: 'value',
    // preM: '[a-l]*',
    min: 'min*',
    max: 'max*',
    r: 'r',
    g: 'g',
    b: 'b',
    h: 'h',
    s: 's',
    l: 'l',
    v: 'v',
    a: 'a',
    x: '@(optionsX|x)',
    y: '@(optionsY|y)',
    z: '@(optionsZ|z)',
    w: '@(optionsW|w)',
    cb1: ['x1', 'y1'],
    cb2: ['x2', 'y2']
    // width: 'width',
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
  'custom-groups': {
    value: '?(bind:)value',
    min: '?(bind:)min',
    max: '?(bind:)max',
    'bind-this': 'bind:this',
    'bind-directives': 'bind:*',
    class: '@(class|class:*)',
    style: '@(style|style:*)',
    'style-props': '--style-props',
    this: 'this',
    'use-directives': 'use:*',
    'on-directives': 'on:*'
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

module.exports = {
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:svelte/recommended',
    'prettier',
    'plugin:perfectionist/recommended-natural'
  ],
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser'
      },
      rules: {
        // https://github.com/nuxt/eslint-config/issues/140
        // https://github.com/typescript-eslint/typescript-eslint/blob/1cf9243/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
        'no-undef': 'off',
        '@typescript-eslint/ban-types': 'off'
      }
    },
    {
      files: ['src/routes/**/*.svelte', 'src/lib-docs/**/*.svelte'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'svelte/no-at-html-tags': 'off'
      }
    }
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
    sourceType: 'module'
  },
  // implicit above?
  // plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    // possible perfectionist conflicts
    '@typescript-eslint/adjacent-overload-signatures': 'off',
    '@typescript-eslint/sort-type-constituents': 'off',
    'import/order': 'off',
    'perfectionist/sort-imports': [
      'error',
      {
        'newlines-between': 'never'
      }
    ],
    'perfectionist/sort-object-types': ['error', perfectionistSortOverrides],
    'perfectionist/sort-objects': ['error', perfectionistSortOverrides],
    'perfectionist/sort-svelte-attributes': ['error', perfectionistSvelteSortOverrides],
    'react/jsx-sort-props': 'off',
    'sort-imports': 'off'
  }
};
