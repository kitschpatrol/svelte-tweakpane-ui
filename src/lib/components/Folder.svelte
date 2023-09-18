<script lang="ts">
	import type { Pane } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import { getElementIndex } from './utils.js';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';

	export let title: string = 'Folder';
	export let disabled: boolean = false;
	export let expanded: boolean = true;

	// save parent context for ourselves
	const parentStore: Writable<Pane | FolderApi | TabPageApi | undefined> =
		getContext('parentStore');

	// overwrite the context for our children
	const folderStore = writable<FolderApi | undefined>(undefined);
	setContext('parentStore', folderStore);

	let indexElement: HTMLDivElement;
	let index: number;

	onMount(() => {
		index = getElementIndex(indexElement);
	});

	function create() {
		if (!$folderStore && $parentStore) {
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
	}

	function destroy() {
		$folderStore?.dispose();
		$folderStore && $parentStore?.remove($folderStore);
	}

	onDestroy(() => {
		destroy();
	});

	$: index !== undefined && $parentStore && create();
	$: $folderStore && ($folderStore.title = title);
	$: $folderStore && ($folderStore.disabled = disabled);
	$: $folderStore && ($folderStore.expanded = expanded);
</script>

<div style="display: none;" bind:this={indexElement}>
	<slot />
</div>
