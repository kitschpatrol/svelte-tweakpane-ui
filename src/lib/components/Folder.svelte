<script lang="ts">
	import type { Pane } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext, setContext } from 'svelte';

	export let title: string = 'Folder';
	export let expanded: boolean = true;
	export let hidden: boolean = false;
	export let disabled: boolean = false;

	let folder: FolderApi;
	let parent: Pane | FolderApi | TabPageApi;

	if (typeof document !== 'undefined') {
		parent = getContext('parent');

		folder = parent.addFolder({
			title,
			hidden,
			disabled,
			expanded
		});

		folder.on('fold', () => {
			expanded = folder.expanded;
		});

		setContext<FolderApi>('parent', folder);
	}

	$: folder && (folder.title = title);
	$: folder && (folder.hidden = hidden);
	$: folder && (folder.disabled = disabled);
	$: folder && (folder.expanded = expanded);

	onDestroy(() => {
		folder?.dispose();
		parent?.remove(folder);
	});
</script>

<slot />
