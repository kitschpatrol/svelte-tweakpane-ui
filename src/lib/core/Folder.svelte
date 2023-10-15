<script lang="ts">
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import { getElementIndex, isRootPane, type TpContainer } from '$lib/utils.js';
	import type { FolderApi } from '@tweakpane/core';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { updateCollapsability } from '$lib/utils.js';

	/** Folder title. */
	export let title: string = 'Folder';

	/** Prevent interactivity. */
	export let disabled: boolean = false;

	/** Expand or collapse folder. Bindable.  */
	export let expanded: boolean | undefined = undefined;

	/** Allow the user to be collapse and expand the foldrer by clicking its title bar. */
	export let collapsable: boolean = true;

	/** Custom color scheme. Only applies if the `<Folder>` is created outside a `<Pane>` component.  */
	export let theme: Theme | undefined = undefined;

	const parentStore: Writable<TpContainer> = getContext('parentStore');
	const folderStore = writable<FolderApi>();
	const userCreatedPane = getContext('userCreatedPane');
	// setContext('userCreatedPane', true); // lie to children

	let indexElement: HTMLDivElement;
	let index: number;
	let folderRef: FolderApi | undefined = undefined;

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
	$: folderRef && updateCollapsability(collapsable, folderRef.element, 'tp-fldv_b', 'tp-fldv_m');
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

<!--
@component
Organize multiple controls into a collapsable folder.

Wraps the Tweakpane [addFolder](https://tweakpane.github.io/docs/ui-components/#folder) method.

Usage outside of a `<Pane>` component will implicitly wrap the folder in a `<InternalPaneInline>`.

Example:	
  ```tsx
	<script>
		let reticulationCount = 0;
	</script>

	<Folder title="Reticulaton Manager">
		<Button title="Reticulate" on:click={() => reticulationCount++} />
		<NumberMonitor label="Reticulations" value={reticulationCount} />
	</Folder>
	```
	-->

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement}>
			<slot />
		</div>
	{:else}
		<InternalPaneInline userCreatedPane={false} {theme}>
			<svelte:self {...$$props}>
				<slot />
			</svelte:self>
		</InternalPaneInline>
	{/if}
{/if}
