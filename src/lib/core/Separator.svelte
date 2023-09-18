<script lang="ts">
	import type { Pane, SeparatorBladeApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext } from 'svelte';
	import { getElementIndex } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';

	export let disabled: boolean = false; // y tho

	const parentStore: Writable<Pane | FolderApi | TabPageApi> = getContext('parentStore');

	let separator: SeparatorBladeApi;
	let indexElement: HTMLDivElement;
	let index: number;

	onMount(() => {
		index = getElementIndex(indexElement);
	});

	function create() {
		separator = $parentStore.addBlade({
			view: 'separator',
			disabled,
			index
		});
	}

	onDestroy(() => {
		separator?.dispose();
	});

	$: index !== undefined && $parentStore && !separator && create();
	$: separator && (separator.disabled = disabled);
</script>

<div style="display: none;" bind:this={indexElement} />
