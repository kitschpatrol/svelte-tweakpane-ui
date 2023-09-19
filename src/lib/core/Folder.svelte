<script lang="ts">
	import type { Pane } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import { getElementIndex } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { BROWSER } from 'esm-env';

	export let title: string = 'Folder';
	export let disabled: boolean = false;
	export let expanded: boolean = true;

	// save parent context for ourselves
	const parentStore: Writable<Pane | FolderApi | TabPageApi> =
		getContext('parentStore') ?? writable();

	if (BROWSER && !getContext('inPane')) {
		console.warn('Tweakpane Folders must be used inside of a <Pane>');
	}

	// overwrite the context for our children
	const folderStore = writable<FolderApi>();
	setContext('parentStore', folderStore);

	let indexElement: HTMLDivElement;
	let index: number;

	onMount(() => {
		index = getElementIndex(indexElement);
	});

	function create() {
		$folderStore = $parentStore.addFolder({
			title,
			disabled,
			expanded,
			index
		});

		$folderStore.on('fold', () => {
			$folderStore && (expanded = $folderStore.expanded);
		});
	}

	onDestroy(() => {
		$folderStore?.dispose();
	});

	$: index !== undefined && $parentStore && !$folderStore && create();
	$: $folderStore && ($folderStore.title = title);
	$: $folderStore && ($folderStore.disabled = disabled);
	$: $folderStore && ($folderStore.expanded = expanded);
</script>

<div style="display: none;" bind:this={indexElement}>
	<slot />
</div>
