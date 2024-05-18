<script context="module" lang="ts">
	import type { BindingApi, BindingParams } from '@tweakpane/core';
	import type { BindingObject } from '$lib/utils';
	import type { ValueChangeEvent } from '$lib/utils.js';

	export type BindingOptions = BindingParams;
	export type BindingRef = BindingApi;

	export type BindingChangeEvent = ValueChangeEvent<BindingObject>;
</script>

<script
	generics="T extends BindingObject, U extends BindingOptions, V extends BindingRef"
	lang="ts"
>
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import {
		type Container,
		type Plugin,
		type UnwrapCustomEvents,
		enforceReadonly,
		getElementIndex,
		isRootPane
	} from '$lib/utils.js';
	import { BROWSER, DEV } from 'esm-env';
	import copy from 'fast-copy';
	import { shallowEqual } from 'fast-equals';
	import { createEventDispatcher, getContext, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	/**
	 * The binding's target object with values to manipulate.
	 * @bindable
	 * */
	export let object: T;

	/** The key for the value in the target `object` that the control should manipulate. */
	export let key: keyof T;

	/**
	 * Prevent interactivity and gray out the control.
	 * @default `false`
	 * */
	export let disabled: boolean = false;

	/**
	 * Text displayed next to control.
	 * @default `undefined`
	 * */
	export let label: string | undefined = undefined;

	/**
	 * Tweakpane's internal options object.
	 *
	 * See [`BindingParams`](https://tweakpane.github.io/docs/api/types/BindingParams.html).
	 *
	 * Valid types are contingent on the type of the value `key` points to in `object`.
	 *
	 * This is intended internal use, when implementing convenience components wrapping Binding's
	 * functionality. Options of interest are instead exposed as top-level props in _Svelte
	 * Tweakpane UI_.
	 * @default `undefined`
	 * */
	export let options: U | undefined = undefined;

	/**
	 * Custom color scheme.
	 *
	 * @default `undefined`  \
	 * Inherits default Tweakpane theme equivalent to `ThemeUtils.presets.standard`, or the theme
	 * set with `setGlobalDefaultTheme()`.
	 * */
	export let theme: Theme | undefined = undefined;

	/**
	 * Reference to internal Tweakpane
	 * [`BindingApi`](https://tweakpane.github.io/docs/api/classes/_internal_.BindingApi.html) for
	 * this control.
	 *
	 * This property is exposed for advanced use cases only, such as when implementing convenience
	 * components wrapping `<Binding>`'s functionality.
	 *
	 * Direct manipulation of Tweakpane's internals can break _Svelte Tweakpane UI_ abstractions.
	 *
	 * @bindable
	 * @readonly
	 * */
	export let ref: V | undefined = undefined;

	/**
	 * Imported Tweakpane `TpPluginBundle` (aliased as `Plugin`) module to automatically register in
	 * the `<Binding>`'s containing `<Pane>`.
	 *
	 * This property is exposed for advanced use cases only, such as when implementing convenience
	 * components wrapping `<Binding>`'s functionality in combination with a Tweakpane plugin.
	 *
	 * Direct manipulation of Tweakpane's internals can break _Svelte Tweakpane UI_ abstractions.
	 *
	 * @default `undefined`
	 * */
	export let plugin: Plugin | undefined = undefined;

	const registerPlugin = getContext<(plugin: Plugin) => void>('registerPlugin');
	const parentStore: Writable<Container> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');

	let _ref: V; // Internal shadow ref
	let indexElement: HTMLDivElement;
	let index: number;

	function create() {
		// Must destroy to allow a reactive `key` parameter
		if (_ref) _ref.dispose();

		if (plugin !== undefined) {
			// Calls function provided by context on the containing pane
			registerPlugin(plugin);
		}

		// Last one wins
		_ref = $parentStore.addBinding(object, key, {
			index,
			label,
			...options,
			disabled // Why last?
		}) as V; // Cast is required by Tweakpane's design

		ref = _ref;

		_ref.on('change', onTweakpaneChange);
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		_ref?.dispose();
	});

	// Inheriting here with ComponentEvents makes a documentation mess

	type $$Events = {
		/**
		 * Fires when the value of `object[key]` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `object` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `object` (`external`).
		 *
		 * @extends ValueChangeEvent
		 * @event
		 * */
		change: BindingChangeEvent;
	};

	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>();

	// Good grief... can't wait for Svelte 5's fine-grained reactivity:
	// Work around for double-reactivity object bug
	// https://github.com/sveltejs/svelte/pull/8992
	// https://github.com/sveltejs/svelte/issues/4265
	// Switching to <svelte:options immutable={true} />
	// at this point would be more involved
	let lastObject: T = object;
	let lastValue: T[keyof T] = copy(object[key]);
	let internalChange = false;
	function onBoundValueChange(object: T) {
		// Check svelte implementation?
		// TODO primitive checks for optimization?
		// TODO need deep for anything?
		// TODO consider completely proxy-ing Tweakpane

		if (lastObject !== object) {
			internalChange = false;
		}

		if (!shallowEqual(object[key], lastValue)) {
			lastValue = copy(object[key]);

			dispatch('change', {
				value: copy(object[key]),
				origin: internalChange ? 'internal' : 'external'
			});

			// Update the value in the pane, but don't fire
			// a Tweakpane change event
			if (!internalChange && _ref) {
				_ref.off('change', onTweakpaneChange);
				_ref.refresh();
				_ref.on('change', onTweakpaneChange);
			}
		}

		internalChange = false;

		// Check for the bound object changing entirely...
		if (lastObject !== object) {
			lastObject = object;
			create(); // Recreation seems to be only way to re-bind to new object
		}
	}

	function onTweakpaneChange() {
		internalChange = true;
		object = object;
	}

	// Readonly props
	$: DEV && enforceReadonly(_ref, ref, 'Binding', 'ref', true);

	// Options seem immutable...
	// have to recreate old version supporting key changes $: key, options,
	$: options, $parentStore !== undefined && index !== undefined && create();
	$: _ref !== undefined && (_ref.disabled = disabled);
	$: _ref !== undefined && (_ref.label = label);

	// A refresh alone doesn't seem to be enough when the object itself (not
	// just its values) has changed, so it's handled in onBoundValueChange
	// $: object, _ref !== undefined && $parentStore !== undefined && _ref.refresh();
	$: $parentStore !== undefined && onBoundValueChange(object);

	$: theme &&
		$parentStore !== undefined &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Binding> components for a theme prop.)'
		);
</script>

<!--
@component  
Wraps the Tweakpane [`addBinding`](https://tweakpane.github.io/docs/input-bindings/) method.

Important: This component is provided for consistency with Tweakpane's API, but is not recommended
for general use in _Svelte Tweakpane UI_ because more helpful abstractions are available.

Please consider convenience components like `<Slider>`, `<Color>`, etc. etc. before using this
component directly.

Usage outside of a `<Pane>` component will implicitly wrap the component in `<Pane
position="inline">`.

@emits {BindingChangeEvent} change - When the value of `object[key]` changes. (This event is provided for advanced use cases. Prefer binding to `object`.)

@example  
```svelte
<script lang="ts">
  import { Binding, type BindingObject } from 'svelte-tweakpane-ui';

  let object: BindingObject = { r: 0 };
</script>

<Binding bind:object key={'r'} label="Reticulation" />
<pre>Value: {object.r}</pre>
```

@sourceLink
[Binding.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/core/Binding.svelte)
-->

{#if parentStore}
	{#if BROWSER}
		<div bind:this={indexElement} style="display: none;"></div>
	{:else}
		<ClsPad keysAdd={['containerVerticalPadding', 'containerUnitSize']} {theme} />
	{/if}
{:else}
	<InternalPaneInline {theme} userCreatedPane={false}>
		<svelte:self
			bind:disabled
			bind:key
			bind:label
			bind:object
			bind:options
			bind:plugin
			bind:ref
			on:change
		/>
	</InternalPaneInline>
{/if}
