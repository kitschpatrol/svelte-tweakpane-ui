<script lang="ts" generics="T extends Bindable, U extends BindingApi">
	import type { Bindable, FolderApi, TabPageApi, BindingApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext } from 'svelte';
	import { getElementIndex, stripProps, type TpContainer } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';
	import type { Theme } from '$lib/theme.js';
	import { applyTheme } from '$lib/theme.js';
	import Pane from './Pane.svelte';
	import { BROWSER } from 'esm-env';

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

	$: key, bindingParams, BROWSER && $parentStore && index !== undefined && create();
	$: params, BROWSER && binding && binding.refresh();
	$: BROWSER && binding && (binding.disabled = disabled);
	$: BROWSER && binding && (binding.label = label);
	$: BROWSER && binding && !userCreatedPane && applyTheme($parentStore.element, theme);
	$: BROWSER &&
		theme &&
		userCreatedPane &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Binding> components for a theme prop.)'
		);

	// Speading the bare $$props array doesn't preserve the bind: prefix
	// So we pull those keys and pass them manually
	const plainProps = stripProps($$props, 'params', 'bindingRef');
</script>

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement} />
	{:else}
		<Pane title="Pane (auto created)" userCreatedPane={false}>
			<svelte:self {...plainProps} bind:params bind:bindingRef />
		</Pane>
	{/if}
{/if}
