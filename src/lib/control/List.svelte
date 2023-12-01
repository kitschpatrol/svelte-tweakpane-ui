<script context="module" lang="ts">
	import type { Simplify } from '$lib/utils';

	// extends tweakpane to take arbitrary arrays of values
	export type ListOptionsArray<T> = T[];
	export type ListOptionsObjectArray<T> = { value: T; text: string }[];
	export type ListOptionsRecord<T> = { [text: string]: T };

	export type ListOptions<T> = Simplify<
		ListOptionsArray<T> | ListOptionsObjectArray<T> | ListOptionsRecord<T>
	>;
</script>

<script generics="T extends any" lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';
	import type { ListBladeApi, ListBladeParams, ListParamsOptions } from 'tweakpane';

	// Use a blade instead of an input to allow for additional value types TODO expose key value
	// option that lets you bind to the active key?
	type $$Props = Omit<
		ComponentProps<Blade<ListBladeParams<T>, ListBladeApi<T>>>,
		'options' | 'plugin' | 'ref'
	> & {
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
		 * The arbitrary array list type is a convenience addition to to the vanilla JS Tweakpane
		 * API.
		 * */
		options: ListOptions<T>;
	};

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
	function isArrayStyleListOptions<T>(obj: ListOptions<T>): obj is { value: T; text: string }[] {
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
				return { value, text: JSON.stringify(value) };
			});
		}
	}

	function setValue() {
		listBlade.value = value;
	}

	$: bladeOptions = {
		value: getInitialValue(),
		label,
		options: getInternalOptions(options),
		view: 'list'
	};
	$: listBlade && addEvent();
	$: value, listBlade && setValue();
</script>

<!--
@component  
An option list picker, similar to an HTML `<select>` element.

Wraps Tweakpane's list blade. See Tweakpane's documentation for [list
blades](https://tweakpane.github.io/docs/blades/#list).

_Svelte Tweakpane UI_ extends Tweakpane's underlying implementation to allow for arbitrary arrays of
values to be used as options. See the `ListOptions` type for details on how to provide specific
labels to options.

Tweakpane's `addBlade` list variations is used instead of the `addBinding` method to allow for
additional value types. The `value` remains bindable via Svelte's reactivity.

Usage outside of a `<Pane>` component will implicitly wrap the color picker in `<Pane
position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { List, type ListOptions } from 'svelte-tweakpane-ui';

  const options: ListOptions<number> = { b: 2, a: 1, c: 3 };
  let selection: number = 1;
</script>

<List bind:value={selection} label="Alphanumerics" {options} />
<pre>Selected Option: {selection}</pre>
```

@sourceLink
[List.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/List.svelte)
-->

<Blade bind:ref={listBlade} options={bladeOptions} {...$$restProps} />
{#if !BROWSER}
	<ClsPad keysAdd={['containerUnitSize']} theme={$$props.theme} />
{/if}