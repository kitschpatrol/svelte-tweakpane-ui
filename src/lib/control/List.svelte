<script context="module" lang="ts">
	import type { Simplify } from '$lib/utils';
	import type { ValueChangeEvent } from '$lib/utils.js';

	// Extends tweakpane to take arbitrary arrays of values
	export type ListOptionsArray<T> = T[];
	export type ListOptionsObjectArray<T> = Array<{ value: T; text: string }>;
	export type ListOptionsRecord<T> = Record<string, T>;

	export type ListOptions<T> = Simplify<
		ListOptionsArray<T> | ListOptionsObjectArray<T> | ListOptionsRecord<T>
	>;

	export type ListChangeEvent = ValueChangeEvent<unknown>;
</script>

<script generics="T extends any" lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import { type UnwrapCustomEvents } from '$lib/utils';
	import { BROWSER } from 'esm-env';
	import copy from 'fast-copy';
	import { shallowEqual } from 'fast-equals';
	import { type ComponentProps, createEventDispatcher } from 'svelte';
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

	// Must redeclare for bindability
	export let value: $$Props['value'];
	export let options: $$Props['options'];
	export let label: $$Props['label'] = undefined;

	// Inheriting here with ComponentEvents makes a documentation mess
	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 *
		 * @extends ValueChangeEvent
		 * @event
		 * */
		change: ListChangeEvent;
	};

	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>();

	let listBlade: ListBladeApi<T>;

	// Note name collision with `options` prop
	let bladeOptions: ListBladeParams<T>;

	function addEvent() {
		listBlade.on('change', (event) => {
			if (!shallowEqual(event.value, value)) {
				value = event.value;

				dispatch('change', {
					value: copy(value),
					origin: 'internal'
				});
			}
		});
	}

	function getInitialValue(): T {
		if (value === undefined) {
			const internalOptions = getInternalOptions(options);
			if (Array.isArray(internalOptions)) {
				value = internalOptions[0].value;
				return value;
			}

			value = internalOptions[Object.keys(internalOptions)[0]];
			return value;
		}

		return value;
	}

	// Type Guards
	function isArrayStyleListOptions<T>(
		object: ListOptions<T>
	): object is Array<{ value: T; text: string }> {
		return (
			Array.isArray(object) &&
			object.every(
				(item) => typeof item === 'object' && item !== null && 'text' in item && 'value' in item
			)
		);
	}

	function isObjectStyleListOptions<T>(object: ListOptions<T>): object is Record<string, T> {
		return typeof object === 'object' && object !== null && !Array.isArray(object);
	}

	function getInternalOptions(options: ListOptions<T>): ListParamsOptions<T> {
		return isArrayStyleListOptions(options)
			? options
			: isObjectStyleListOptions(options)
				? options
				: options.map((value) => ({ value, text: JSON.stringify(value) }));
	}

	function setValue() {
		if (!shallowEqual(listBlade.value, value)) {
			listBlade.value = value;

			dispatch('change', {
				value: copy(value),
				origin: 'external'
			});
		}
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

@emits {ListChangeEvent} change - When `value` changes. (For advanced use cases. Prefer binding to `value`.)

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
