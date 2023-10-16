<script lang="ts" generics="T extends Bindable, U extends BindingApi">
	import type { Theme } from '$lib/theme.js';
	import { getElementIndex, isRootPane, type TpContainer } from '$lib/utils.js';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { Bindable, BindingApi } from '@tweakpane/core';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	/** Object with values to manipulate. */
	export let params: T;

	/** The key for the value in the params object the control should manipulate. */
	export let key: string;

	/** Prevent interactivity. Defaults to `false`. */
	export let disabled: boolean = false;

	/** Text displayed next to control. */
	export let label: string | undefined = undefined;

	/** Control configuration exposing TweakPane's internal [BindingParams](https://tweakpane.github.io/docs/api/types/BindingParams.html), contingent on type of bound param. TODO: Templatized types. */
	export let bindingParams: object | undefined = undefined;

	/** Custom color scheme. Only applies if the `<Binding>` is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;

	/** Bindable reference to internal TweakPane [BindingApi](https://tweakpane.github.io/docs/api/classes/_internal_.BindingApi.html) for this control, not generally intended for direct use */
	export let bindingRef: U | undefined = undefined;

	const parentStore: Writable<TpContainer> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');

	let binding: U;
	let indexElement: HTMLDivElement;
	let index: number;

	function create() {
		console.log('binding created');

		// must destroy to allow a reactive `key` parameter
		if (binding) binding.dispose();

		// last one wins
		binding = $parentStore.addBinding(params, key, {
			index,
			label,
			...bindingParams,
			disabled
		}) as U;

		bindingRef = binding;

		binding.on('change', () => {
			// todo stick with reactive?
			// dispatch('change', ev);
			// trigger reactivity
			params = params;
		});
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		binding?.dispose();
	});

	// bindingParams seem immutable... have to recreate
	// old version supporting key changes
	// $: key, bindingParams, BROWSER && $parentStore !== undefined && index !== undefined && create();
	$: bindingParams, BROWSER && $parentStore !== undefined && index !== undefined && create();
	$: params, BROWSER && binding !== undefined && binding.refresh();
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

Usage outside of a `<Pane>` component will implicitly wrap the component in a `<InternalPaneInline>`.

Consider convenience components like `<Slider>`, `<ColorPicker>`, etc. before using this component directly.

Example:	
```tsx
<script lang="ts">
	let params = { n: 0 };
</script>

<Binding bind:params key={'r'} label="Reticulation" />

Value: {params.r}
```
-->

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement} />
	{:else}
		<InternalPaneInline userCreatedPane={false} {theme}>
			<!-- Everything must be manually bound instead of spreading props due to lack of access to binding  -->
			<svelte:self
				bind:key
				bind:disabled
				bind:label
				bind:params
				bind:bindingRef
				bind:bindingParams
			/>
		</InternalPaneInline>
	{/if}
{/if}
