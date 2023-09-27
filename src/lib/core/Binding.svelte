<script lang="ts" generics="T extends Bindable, U extends BindingApi">
	import type { Theme } from '$lib/theme.js';
	import { getElementIndex, isRootPane, stripProps, type TpContainer } from '$lib/utils.js';
	import PaneInline from '$lib/core/PaneInline.svelte';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { Bindable, BindingApi } from '@tweakpane/core';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let params: T;
	export let key: string;
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let bindingParams: object | undefined = undefined;
	export let theme: Theme | undefined = undefined;
	export let bindingRef: U | undefined = undefined;

	const parentStore: Writable<TpContainer> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');

	let binding: U;
	let indexElement: HTMLDivElement;
	let index: number;

	function create() {
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
	$: key, bindingParams, BROWSER && $parentStore !== undefined && index !== undefined && create();
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

	// Speading the bare $$props array doesn't preserve the bind: prefix
	// So we pull those keys and pass them manually
	const plainProps = stripProps($$props, 'params', 'bindingRef', 'theme');
</script>

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement} />
	{:else}
		<PaneInline userCreatedPane={false} {theme}>
			<svelte:self {...plainProps} bind:params bind:bindingRef />
		</PaneInline>
	{/if}
{/if}
