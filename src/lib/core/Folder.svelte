<script lang="ts">
	import type { FolderApi as FolderRef } from '@tweakpane/core';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import { type Container, getElementIndex, isRootPane, updateCollapsibility } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';

	/**
	 * Text in folder title bar.
	 * @default `'Folder'`
	 * */
	export let title: string = 'Folder';

	/**
	 * Prevent interactivity.
	 * @default `false`
	 * */
	export let disabled: boolean = false;

	/**
	 * Expand or collapse folder.
	 * @default `true`
	 * @bindable
	 * */
	export let expanded: boolean | undefined = undefined;

	/**
	 * Allow the user to be collapse and expand the folder by clicking its title bar.
	 * @default `true`
	 * */
	export let clickToExpand: boolean = true;

	/**
	 * Custom color scheme.
	 * @default `undefined`  \
	 * Inherits default Tweakpane theme equivalent to `THEMES.standard`, or the theme set with
	 * `setGlobalDefaultTheme()`.
	 * */
	export let theme: Theme | undefined = undefined;

	const parentStore: Writable<Container> = getContext('parentStore');
	const folderStore = writable<FolderRef>();
	const userCreatedPane = getContext('userCreatedPane');

	let indexElement: HTMLDivElement;
	let index: number;
	let folderRef: FolderRef | undefined = undefined;

	// overwrite the context for our children
	setContext('parentStore', folderStore);

	function create() {
		// console.log('folder created');

		$folderStore = $parentStore.addFolder({
			disabled,
			expanded,
			index,
			title
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

	$: BROWSER && $parentStore && !folderRef && index !== undefined && create();
	$: BROWSER &&
		folderRef &&
		updateCollapsibility(clickToExpand, folderRef.element, 'tp-fldv_b', 'tp-fldv_m');
	$: BROWSER && folderRef && (folderRef.title = title);
	$: BROWSER && folderRef && (folderRef.disabled = disabled);
	$: BROWSER && folderRef && expanded !== undefined && (folderRef.expanded = expanded); // doing this on $folderStore causes issues
	$: BROWSER &&
		theme &&
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

Usage outside of a `<Pane>` component will implicitly wrap the folder in `<Pane position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { Button, Checkbox, Folder, Monitor } from 'svelte-tweakpane-ui';

  let expanded = true;
  let count = 0;
</script>

<Folder bind:expanded title="Reticulation Manager">
  <Button on:click={() => count++} title="Increment" />
  <Monitor value={count} label="Count" />
</Folder>

<Checkbox bind:value={expanded} label="Expanded" />
```

@sourceLink
[Folder.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/core/Folder.svelte)
-->

{#if BROWSER}
	{#if parentStore}
		<div bind:this={indexElement} style="display: none;">
			<slot />
		</div>
	{:else}
		<InternalPaneInline {theme} userCreatedPane={false}>
			<svelte:self bind:expanded {clickToExpand} {disabled} {title}>
				<slot />
			</svelte:self>
		</InternalPaneInline>
	{/if}
{/if}
