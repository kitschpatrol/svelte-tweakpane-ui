<script lang="ts">
	import type { Pane } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext, setContext } from 'svelte';

	export let title: string = 'Folder';
	export let expanded: boolean = true;
	export let disabled: boolean = false;

	let folder: FolderApi;
	let parent: Pane | FolderApi | TabPageApi;

	if (typeof document !== 'undefined') {
		parent = getContext('parent');

		folder = parent.addFolder({
			title,
			disabled,
			expanded
		});

		folder.on('fold', () => {
			expanded = folder.expanded;
		});

		setContext<FolderApi>('parent', folder);
	}

	$: folder && (folder.title = title);
	$: folder && (folder.disabled = disabled);
	$: folder && (folder.expanded = expanded);

	onDestroy(() => {
		folder?.dispose();
		parent?.remove(folder);
	});
</script>

<slot />
