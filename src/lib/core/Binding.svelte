<script lang="ts" generics="T extends Bindable, U extends BindingApi">
	import type { Pane } from 'tweakpane';
	import type {
		Bindable,
		FolderApi,
		TabPageApi,
		BindingApi,
		BaseInputParams
	} from '@tweakpane/core';
	import { onMount, onDestroy, getContext, createEventDispatcher } from 'svelte';
	import { createPane, getElementIndex } from '$lib/utils.js';
	import { writable, type Writable } from 'svelte/store';

	export let params: T;
	export let key: string;
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let bindingParams: object | undefined = undefined;

	// dangerous but allows access when needed
	export let bindingRef: U | undefined = undefined;

	const parentStore: Writable<Pane | FolderApi | TabPageApi> =
		getContext('parentStore') ?? writable();
	const inPane = getContext('inPane');
	// const dispatch = createEventDispatcher();

	let indexElement: HTMLDivElement;
	let binding: U;
	let index: number;

	onMount(() => {
		index = getElementIndex(indexElement);

		if (!inPane) {
			$parentStore = createPane({ expanded: true }, true);
			indexElement.replaceWith($parentStore.element);
		}
	});

	function create() {
		// must destroy to allow a reactive `key` parameter
		if (binding) binding.dispose();

		// last one wins
		binding = $parentStore.addBinding(params, key, {
			...{ index, label },
			...bindingParams,
			...{ disabled }
		}) as U;
		bindingRef = binding;

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
	$: binding && (binding.label = label);
</script>

<div style="display: none;" bind:this={indexElement} />
