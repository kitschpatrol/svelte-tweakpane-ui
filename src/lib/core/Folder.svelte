<script lang="ts">
	import PaneInline from '$lib/core/PaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import { getElementIndex, isRootPane, type TpContainer } from '$lib/utils.js';
	import type { FolderApi } from '@tweakpane/core';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';

	// scoped themes don't work
	export let title: string = 'Folder';
	export let disabled: boolean = false;
	export let expanded: boolean | undefined = undefined;
	export let theme: Theme | undefined = undefined;
	export let folderRef: FolderApi | undefined = undefined;

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

		folderRef = $folderStore;
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		$folderStore?.dispose();
	});

	$: $parentStore && !folderRef && index !== undefined && create();
	$: folderRef && (folderRef.title = title);
	$: folderRef && (folderRef.disabled = disabled);
	$: folderRef && expanded !== undefined && (folderRef.expanded = expanded); // doing this on $folderStore causes issues
	$: theme &&
		$parentStore &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Folder> components for a theme prop.)'
		);
</script>

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement}>
			<slot />
		</div>
	{:else}
		<PaneInline userCreatedPane={false} {theme}>
			<svelte:self {...$$props}>
				<slot />
			</svelte:self>
		</PaneInline>
	{/if}
{/if}
