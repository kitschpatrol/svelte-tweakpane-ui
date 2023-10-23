<script lang="ts">
	import type { FolderApi } from '@tweakpane/core';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import InternalPaneInline from '../internal/InternalPaneInline.svelte';
	import type { Theme } from '../theme.js';
	import { getElementIndex, isRootPane, updateCollapsability, type Container } from '../utils.js';

	/** Text in folder title bar.
	 * @default `'Folder'`
	 */
	export let title: string = 'Folder';

	/** Prevent interactivity.
	 * @default `false`
	 */
	export let disabled: boolean = false;

	/** Expand or collapse folder.
	 * @emits
	 */
	export let expanded: boolean | undefined = undefined;

	/** Allow the user to be collapse and expand the folder by clicking its title bar.
	 * @default `true`
	 */
	export let clickToExpand: boolean = true;

	/** Custom color scheme. Only applies if the `<Folder>` is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;

	const parentStore: Writable<Container> = getContext('parentStore');
	const folderStore = writable<FolderApi>();
	const userCreatedPane = getContext('userCreatedPane');
	// setContext('userCreatedPane', true); // lie to children

	let indexElement: HTMLDivElement;
	let index: number;
	let folderRef: FolderApi | undefined = undefined;

	// overwrite the context for our children
	setContext('parentStore', folderStore);

	function create() {
		console.log('folder created');

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
	$: folderRef && updateCollapsability(clickToExpand, folderRef.element, 'tp-fldv_b', 'tp-fldv_m');
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

Usage outside of a `<Pane>` component will implicitly wrap the folder in `<Pane position='inline'>`.

Example:	
```tsx
<script lang="ts">
	import { FolderApi, ButtonApi, Monitor, Checkbox  } from 'svelte-tweakpane-ui';

	let expanded = true;
	let count = 0;
</script>

<Folder title="Reticulaton Manager" {expanded} >
	<Button title="Increment" on:click={() => count++} />
	<Monitor label="Count" value={count} />
</Folder>

<Checkbox label="Expanded" bind:value={expanded} />
```
-->

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement}>
			<slot />
		</div>
	{:else}
		<InternalPaneInline userCreatedPane={false} {theme}>
			<!-- {...$$props} breaks types -->
			<svelte:self {title} {disabled} {expanded} {clickToExpand}>
				<slot />
			</svelte:self>
		</InternalPaneInline>
	{/if}
{/if}
