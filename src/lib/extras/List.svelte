<script lang="ts" context="module">
	// extends tweakpane to take arbitrary arrays of values
	export type ListOptions<T> = { text: string; value: T }[] | { [text: string]: T } | T[];
</script>

<script lang="ts" generics="T extends any">
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';
	import type { ListBladeApi, ListBladeParams, ListParamsOptions } from 'tweakpane';
	import Blade from '../core/Blade.svelte';

	// Use a blade instead of an input to allow for additional value types
	// TODO expose key value option that lets you bind to the active key?
	interface $$Props
		extends Omit<
			ComponentProps<Blade<ListBladeParams<T>, ListBladeApi<T>>>,
			'options' | 'ref' | 'plugin'
		> {
		/**
		 * Value of the selected `options` item.
		 * @bindable
		 * */
		value: T;
		/**
		 * Text displayed next to list.
		 * @default `undefined`
		 * */
		label?: string;
		/**
		 * A collection of options to select from.
		 *
		 * The arbitrary array list type is a convenience addition to to vanilla Tweakpane's API.
		 * */
		options: ListOptions<T>;
	}

	// must redeclare for bindability
	export let value: $$Props['value'];
	export let options: $$Props['options'];
	export let label: $$Props['label'] = undefined;

	let listBlade: ListBladeApi<T>;

	// note name collision with `options` prop
	let bladeOptions: ListBladeParams<T>;

	function addEvent() {
		listBlade.on('change', (ev) => {
			value = ev.value;
		});
	}

	function getInitialValue() {
		if (value === undefined) {
			const internalOptions = getInternalOptions(options);
			if (Array.isArray(internalOptions)) {
				value = internalOptions[0].value;
				return value;
			} else {
				value = internalOptions[Object.keys(internalOptions)[0]];
				return value;
			}
		} else {
			return value;
		}
	}

	// Type Guards
	function isArrayStyleListOptions<T>(obj: ListOptions<T>): obj is { text: string; value: T }[] {
		return (
			Array.isArray(obj) &&
			obj.every(
				(item) => typeof item === 'object' && item !== null && 'text' in item && 'value' in item
			)
		);
	}

	function isObjectStyleListOptions<T>(obj: ListOptions<T>): obj is { [text: string]: T } {
		return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
	}

	function getInternalOptions(options: ListOptions<T>): ListParamsOptions<T> {
		if (isArrayStyleListOptions(options)) {
			return options;
		} else if (isObjectStyleListOptions(options)) {
			return options;
		} else {
			return options.map((value) => {
				return { text: JSON.stringify(value), value };
			});
		}
	}

	function setValue() {
		listBlade.value = value;
	}

	$: BROWSER &&
		(bladeOptions = {
			value: getInitialValue(),
			view: 'list',
			label,
			options: getInternalOptions(options)
		} as ListBladeParams<T>);
	$: BROWSER && listBlade && addEvent();
	$: value, BROWSER && listBlade && setValue();
</script>

<!--
@component
An option list picker, similar to an HTML `<select>` element.

Wraps Tweakpane's list blade. See Tweakpane's documentation for [list blades](https://tweakpane.github.io/docs/blades/#list).

`svelte-tweakpane-ui` extends Tweakpane's underlying implementation to allow for arbitrary arrays of values to be used as options. See the `ListOptions` type for details on how to provide specific labels to options.

Tweakpane's `addBlade` list variations is used instead of the `addBinding` method to allow for additional value types. The `value` remains bindable via Svelte's reactivity.

Usage outside of a `<Pane>` component will implicitly wrap the color picker in `<Pane position='inline'>`.

@example	
```tsx
<script lang="ts">
	import { List, type ListOptions } from 'svelte-tweakpane-ui';

	const options:ListOptions = { a: 1, b: 2, c: 3 };
	let selection: number = 1;
</script>

<List label="Alphanumerics" bind:value={selection} {options} />
<pre>
	Selected Option: {Selection}
</pre>
```

@sourceLink
-->

{#if BROWSER}
	<Blade bind:ref={listBlade} options={bladeOptions} {...$$restProps} />
{/if}
