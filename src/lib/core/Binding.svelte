<script lang="ts">
	import type { BindingParams } from 'tweakpane';
	import { Pane } from 'tweakpane';
	import type { Bindable, FolderApi, TabPageApi, BindingApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext, createEventDispatcher } from 'svelte';
	import { getElementIndex } from '$lib/utils.js';
	import { writable, type Writable } from 'svelte/store';

	export let params: Bindable;
	export let key: string;
	export let bindingParams: BindingParams | undefined = undefined;
	export let disabled: boolean = false;

	const parentStore: Writable<Pane | FolderApi | TabPageApi> =
		getContext('parentStore') ?? writable();
	const inPane = getContext('inPane');
	// const dispatch = createEventDispatcher();

	let indexElement: HTMLDivElement;
	let binding: BindingApi;
	let index: number;

	onMount(() => {
		index = getElementIndex(indexElement);

		if (!inPane) {
			$parentStore = new Pane({ expanded: true });
			indexElement.replaceWith($parentStore.element);
		}
	});

	function create() {
		// must destroy to allow a reactive `key` parameter
		if (binding) binding.dispose();

		binding = $parentStore.addBinding(params, key, {
			...{ index },
			...bindingParams
		});

		binding.on('change', () => {
			// todo stick with reactive?
			// dispatch('change', ev);

			// trigger reactivity
			params = params;
		});
	}

	onDestroy(() => {
		binding?.dispose();
		!inPane && $parentStore?.dispose();
	});

	$: key, bindingParams, $parentStore && index !== undefined && create();
	$: params, binding && binding.refresh();
	$: binding && (binding.disabled = disabled);
</script>

<div style="display: none;" bind:this={indexElement} />
