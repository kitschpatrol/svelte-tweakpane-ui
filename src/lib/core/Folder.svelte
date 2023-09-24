<script lang="ts">
	import type { Pane as TpPane } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import { getElementIndex } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { BROWSER } from 'esm-env';
	import Pane from './Pane.svelte';

	export let title: string = 'Folder';
	export let disabled: boolean = false;
	export let expanded: boolean | undefined = undefined;

	// save parent context for ourselves
	const parentStore: Writable<TpPane | FolderApi | TabPageApi> =
		getContext('parentStore') ?? writable();
	const inPane = getContext('inPane');

	if (BROWSER && !inPane) {
		console.warn('Tweakpane Folders must be used inside of a <Pane>');
	}

	// overwrite the context for our children
	const folderStore = writable<FolderApi>();
	setContext('parentStore', folderStore);

	let indexElement: HTMLDivElement;
	let index: number;
	let paneRef: TpPane;

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
	$: $folderStore && disabled !== undefined && ($folderStore.disabled = disabled);
	$: $folderStore && expanded !== undefined && ($folderStore.expanded = expanded);
	$: if (paneRef !== undefined) $parentStore = paneRef;

	// $: $folderStore && $parentStore && paneRef && ($parentStore = paneRef);
</script>

{#if !inPane}
	<Pane bind:paneRef>
		<div style="display: none;" bind:this={indexElement}>
			<slot />
		</div>
	</Pane>
{:else}
	<div style="display: none;" bind:this={indexElement}>
		<slot />
	</div>
{/if}
