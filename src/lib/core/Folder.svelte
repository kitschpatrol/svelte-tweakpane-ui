<script lang="ts">
	import type { Pane as TpPane } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import { getElementIndex, type TpContainer } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { BROWSER } from 'esm-env';
	import Pane from './Pane.svelte';

	// scoped themes don't work
	export let title: string = 'Folder';
	export let disabled: boolean = false;
	export let expanded: boolean | undefined = undefined;

	const parentStore: Writable<TpContainer> = getContext('parentStore');
	const folderStore = writable<FolderApi>();
	const userCreatedPane = getContext('userCreatedPane');
	// setContext('userCreatedPane', true); // lie to children

	let indexElement: HTMLDivElement;
	let index: number;

	// overwrite the context for our children
	setContext('parentStore', folderStore);

	function create() {
		$folderStore = $parentStore.addFolder({
			title,
			disabled,
			expanded,
			index
		});

		$folderStore.on('fold', () => {
			expanded = $folderStore.expanded;
		});
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		$folderStore?.dispose();
	});

	$: BROWSER && $parentStore && !$folderStore && index !== undefined && create();
	$: BROWSER && $folderStore && ($folderStore.title = title);
	$: BROWSER && $folderStore && ($folderStore.disabled = disabled);
	// TODO animation jankiness
	//$: BROWSER && $folderStore && ($folderStore.expanded = expanded);
</script>

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement}>
			<slot />
		</div>
	{:else}
		<Pane userCreatedPane={false} mode="inline">
			<svelte:self {...$$props}>
				<slot />
			</svelte:self>
		</Pane>
	{/if}
{/if}
