<script context="module" lang="ts">
	import type { BindingApi, BindingParams } from '@tweakpane/core';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BindingObject } from '$lib/utils';
	export type BindingOptions = BindingParams;
	export type BindingRef = BindingApi;
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
		enforceReadonly,
		getElementIndex,
		isRootPane
	} from '$lib/utils.js';
	import { BROWSER, DEV } from 'esm-env';
	import { getContext, onDestroy, onMount } from 'svelte';
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
	 * This is primarily for internal use, when implementing convenience components wrapping
	 * Binding's functionality.
	 * @bindable
	 * @readonly
	 * */
	export let ref: V | undefined = undefined;

	/**
	 * Imported Tweakpane `TpPluginBundle` (aliased as `Plugin`) module to automatically register in
	 * the binding's containing `<Pane>`.
	 *
	 * This is primarily for internal use, when implementing convenience components wrapping
	 * Binding's functionality in combination with a Tweakpane plugin.
	 * @default `undefined`
	 * */
	export let plugin: Plugin | undefined = undefined;

	const registerPlugin = getContext<(plugin: Plugin) => void>('registerPlugin');
	const parentStore: Writable<Container> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');

	let _ref: V; // internal shadow ref
	let indexElement: HTMLDivElement;
	let index: number;

	function create() {
		// console.log('binding created');

		// must destroy to allow a reactive `key` parameter
		if (_ref) _ref.dispose();

		if (plugin !== undefined) {
			// calls function provided by context on the containing pane
			registerPlugin(plugin);
		}

		// last one wins
		_ref = $parentStore.addBinding(object, key, {
			index,
			label,
			...options,
			disabled
		}) as V; // cast is required by Tweakpane's design

		ref = _ref;

		_ref.on('change', () => {
			// trigger reactivity
			object = object;
		});
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		_ref?.dispose();
	});

	// readonly props
	$: DEV && enforceReadonly(_ref, ref, 'Binding', 'ref', true);

	// options seem immutable... have to recreate old version supporting key changes $: key,
	// options,
	$: options, $parentStore !== undefined && index !== undefined && create();
	$: object, _ref !== undefined && _ref.refresh();
	$: _ref !== undefined && (_ref.disabled = disabled);
	$: _ref !== undefined && (_ref.label = label);

	$: theme &&
		$parentStore &&
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
position='inline'>`.

@example  
```svelte
<script lang="ts">
import { Binding, type BindingObject } from 'svelte-tweakpane-ui';

let object: BindingObject = { r: 0 };
</script>

<Binding bind:object={object} key={'r'} label="Reticulation" />
<pre>Value: {object.r}</pre>
```

@sourceLink
[Binding.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/core/Binding.svelte)
-->

{#if parentStore}
	{#if BROWSER}
		<div bind:this={indexElement} style="display: none;" />
	{:else}
		<ClsPad keysAdd={['containerVerticalPadding', 'containerUnitSize']} {theme} />
	{/if}
{:else}
	<InternalPaneInline {theme} userCreatedPane={false}>
		<svelte:self bind:disabled bind:key bind:label bind:object bind:options bind:plugin bind:ref />
	</InternalPaneInline>
{/if}
