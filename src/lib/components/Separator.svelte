<script lang="ts">
	import type { Pane, SeparatorBladeApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext } from 'svelte';
	import { getElementIndex } from './utils.js';
	import type { Writable } from 'svelte/store';

	export let disabled: boolean = false; // y tho

	const parentStore: Writable<Pane | FolderApi | TabPageApi | undefined> =
		getContext('parentStore');

	let separator: SeparatorBladeApi;
	let indexElement: HTMLDivElement;
	let index: number;

	onMount(() => {
		index = getElementIndex(indexElement);
	});

	function create() {
		if (!separator && $parentStore) {
			separator = $parentStore.addBlade({
				view: 'separator',
				disabled,
				index
			});
		}
	}

	function destroy() {
		separator?.dispose();
	}

	onDestroy(() => {
		destroy();
	});

	$: index !== undefined && $parentStore && create();
	$: separator && (separator.disabled = disabled);
</script>

<div style="display: none;" bind:this={indexElement} />
