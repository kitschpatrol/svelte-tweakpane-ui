<script lang="ts">
	import type { Pane, TabApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onDestroy, getContext, setContext } from 'svelte';
	import { writable } from 'svelte/store';

	export let disabled: boolean = false;

	// pass the tab context down as a store instead of a plain
	// context, so that the child pages can edit it when needed
	// that lets us support a childless <Tab /> component, where
	// the first page to be added handles construction of the tab
	// this is necessary because the tweakpane tab API can only construct
	// tab groups with at least one page
	const tabStore = writable<TabApi | undefined>(undefined);
	let parent: Pane | FolderApi | TabPageApi;

	if (typeof document !== 'undefined') {
		parent = getContext('parent');
		setContext('tabStore', tabStore);
		// TODO expose active index?
	}

	onDestroy(() => {
		if ($tabStore) {
			$tabStore.pages.forEach((p, i) => {
				$tabStore?.removePage(i);
			});
			parent?.remove($tabStore);
			$tabStore.dispose();
		}
	});

	$: $tabStore && ($tabStore.disabled = disabled);
</script>

<slot />
