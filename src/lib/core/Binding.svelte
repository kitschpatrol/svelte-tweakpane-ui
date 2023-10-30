<script lang="ts" context="module">
	import type { BindingApi, BindingParams } from '@tweakpane/core';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BindingObject } from '$lib/utils';
	export type BindingOptions = BindingParams;
	export type BindingRef = BindingApi;
</script>

<script
	lang="ts"
	generics="T extends BindingObject, U extends BindingOptions, V extends BindingRef"
>
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import { getElementIndex, isRootPane, type Container, type Plugin } from '$lib/utils.js';

	/**
	 * The binding target object with values to manipulate.
	 * @bindable
	 * */
	export let object: T;

	/** The key for the value in the target object that the control should manipulate. */
	export let key: keyof T;

	/**
	 * Prevent interactivity.
	 * @default `false`
	 * */
	export let disabled: boolean = false;

	/**
	 * Text displayed next to control.
	 * @default `undefined`
	 * */
	export let label: string | undefined = undefined;

	/**
	 * Control configuration exposing TweakPane's internal [BindingParams](https://tweakpane.github.io/docs/api/types/BindingParams.html), contingent on type of bound param.
	 * @default `undefined`
	 * */
	export let options: U | undefined = undefined;

	/**
	 * Custom color scheme.
	 *
	 * Default: `undefined` (Inherits default Tweakpane theme equivalent to `THEMES.standard`, or the theme set with `setGlobalDefaultTheme()`.)
	 * */
	export let theme: Theme | undefined = undefined;

	/**
	 * Reference to internal TweakPane [BindingApi](https://tweakpane.github.io/docs/api/classes/_internal_.BindingApi.html) for this control.
	 * @bindable
	 * @readonly
	 * */
	export let ref: V | undefined = undefined;

	/**
	 * Imported Tweakpane `TpPluginBundle` (aliased as `Plugin`) module to automatically register in the binding's containing `<Pane>`.
	 * @default `undefined`
	 * */
	export let plugin: Plugin | undefined = undefined;

	const registerPlugin = getContext<(plugin: Plugin) => void>('registerPlugin');
	const parentStore: Writable<Container> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');

	let binding: V; // effectively makes ref read only
	let indexElement: HTMLDivElement;
	let index: number;

	function create() {
		// console.log('binding created');

		// must destroy to allow a reactive `key` parameter
		if (binding) binding.dispose();

		if (plugin !== undefined) {
			// calls function provided by context on the containing pane
			registerPlugin(plugin);
		}

		// last one wins
		binding = $parentStore.addBinding(object, key, {
			index,
			label,
			...options,
			disabled
		}) as V; // todo can't shake ts(2322)

		ref = binding;

		binding.on('change', () => {
			// todo stick with reactive?
			// dispatch('change', ev);
			// trigger reactivity
			object = object;
		});
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		binding?.dispose();
	});

	// options seem immutable... have to recreate
	// old version supporting key changes
	// $: key, options, BROWSER && $parentStore !== undefined && index !== undefined && create();
	$: options, BROWSER && $parentStore !== undefined && index !== undefined && create();
	$: object, BROWSER && binding !== undefined && binding.refresh();
	$: BROWSER && binding !== undefined && (binding.disabled = disabled);
	$: BROWSER && binding !== undefined && (binding.label = label);

	$: BROWSER &&
		theme &&
		$parentStore &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Binding> components for a theme prop.)'
		);
</script>

<!--
@component
Wraps the Tweakpane [addBinding](https://tweakpane.github.io/docs/input-bindings/) method.

Usage outside of a `<Pane>` component will implicitly wrap the component in `<Pane position='inline'>`.

Consider convenience components like `<Slider>`, `<Color>`, etc. before using this component directly.

@example	
```tsx
<script lang="ts">
	import { Binding, type BindingObject } from 'svelte-tweakpane-ui';
	
	let object: BindingObject = { r: 0 };
</script>

<Binding bind:object key={'r'} label="Reticulation" />
<pre>
Value: {object.r}
</pre>
```

@sourceLink
-->

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement} />
	{:else}
		<InternalPaneInline userCreatedPane={false} {theme}>
			<svelte:self
				bind:key
				bind:disabled
				bind:label
				bind:object
				bind:ref
				bind:options
				bind:plugin
			/>
		</InternalPaneInline>
	{/if}
{/if}
