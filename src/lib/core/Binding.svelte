<script lang="ts">
	import type { BindingParams, Pane } from 'tweakpane';
	import type { Bindable, FolderApi, TabPageApi, BindingApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext } from 'svelte';
	import { getElementIndex } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';

	// generic for the bound value type of this input
	// TODO necessary?
	// type T = $$Generic;

	export let params: Bindable;
	export let key: string;
	export let bindingParams: BindingParams | undefined = undefined;
	export let disabled: boolean = false;

	const parentStore: Writable<Pane | FolderApi | TabPageApi> = getContext('parentStore');
	let indexElement: HTMLDivElement;
	let binding: BindingApi;
	let index: number;

	onMount(() => {
		index = getElementIndex(indexElement);
	});

	function create() {
		// must destroy to allow a reactive `key` parameter
		if (binding) binding.dispose();

		binding = $parentStore.addBinding(params, key, {
			...{ index },
			...bindingParams
		});

		binding.on('change', () => {
			// trigger reactivity
			params = params;
		});
	}

	onDestroy(() => {
		binding?.dispose();
	});

	$: params, binding && binding.refresh();
	$: binding && (binding.disabled = disabled);
	$: key, index !== undefined && create();
</script>

<div style="display: none;" bind:this={indexElement} />
