<script lang="ts">
	import type { BindingParams, Pane } from 'tweakpane';
	import type { Bindable, FolderApi, TabPageApi, BindingApi } from '@tweakpane/core';
	import { onDestroy, getContext } from 'svelte';
	import { getElementIndex } from './utils.js';
	import type { Writable } from 'svelte/store';

	// generic for the bound value type of this input
	// TODO necessary?
	// type T = $$Generic;

	export let params: Bindable;
	export let key: string;
	export let bindingParams: BindingParams | undefined = undefined;
	export let disabled: boolean = false;

	let binding: BindingApi;
	const parentStore: Writable<Pane | FolderApi | TabPageApi | undefined> =
		getContext('parentStore');
	let indexElement: HTMLDivElement;

	function create() {
		// must destroy to allow a reactive `key` parameter
		destroy();
		if ($parentStore) {
			const index = getElementIndex(indexElement);
			binding = $parentStore.addBinding(params, key, { ...{ index }, ...bindingParams });

			binding.on('change', () => {
				// trigger reactivity
				params = params;
			});
		}
	}

	function destroy() {
		if (binding) {
			binding.dispose();
			$parentStore?.remove(binding);
		}
	}

	onDestroy(() => {
		destroy();
	});

	$: params, binding && binding.refresh();
	$: binding && (binding.disabled = disabled);
	$: key, indexElement && $parentStore && create();
</script>

<div style="display: none;" bind:this={indexElement} />
