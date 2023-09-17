<script lang="ts">
	import type { BindingParams, Pane } from 'tweakpane';
	import type { Bindable, FolderApi, TabPageApi, BindingApi } from '@tweakpane/core';
	import { onDestroy, getContext } from 'svelte';

	// generic for the bound value type of this input
	type T = $$Generic;

	export let params: Bindable;
	export let key: string = 'Binding';
	export let bindingParams: BindingParams | undefined = undefined;

	let binding: BindingApi;
	let parent: Pane | FolderApi | TabPageApi;

	if (typeof document !== 'undefined') {
		parent = getContext('parent');

		binding = parent.addBinding(params, key, bindingParams);
	}

	onDestroy(() => {
		binding?.dispose();
		binding && parent?.remove(binding);
	});
</script>
