<script lang="ts">
	import type { SeparatorBladeApi } from 'tweakpane';
	import { Pane } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext } from 'svelte';
	import { getElementIndex } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';

	export let disabled: boolean = false; // y tho

	const parentStore: Writable<Pane | FolderApi | TabPageApi> =
		getContext('parentStore') ?? writable();
	const inPane = getContext('inPane');

	let separator: SeparatorBladeApi;
	let indexElement: HTMLDivElement;
	let index: number;

	onMount(() => {
		index = getElementIndex(indexElement);

		if (!inPane) {
			$parentStore = new Pane({ expanded: true });
			indexElement.replaceWith($parentStore.element);
		}
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
		!inPane && $parentStore?.dispose();
	});

	$: index !== undefined && $parentStore && !separator && create();
	$: separator && (separator.disabled = disabled);
</script>

<div style="display: none;" bind:this={indexElement} />
