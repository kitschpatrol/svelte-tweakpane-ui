<script lang="ts">
	import type { Pane, TabApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onDestroy, getContext, setContext } from 'svelte';

	export let hidden: boolean = false;
	export let disabled: boolean = false;

	let tab: TabApi;
	let parent: Pane | FolderApi | TabPageApi;

	if (typeof document !== 'undefined') {
		parent = getContext('parent');

		const tab = parent.addTab({
			pages: [{ title: 'Add <Page> child components to this <Tab>!' }],
			disabled,
			hidden
		});

		setContext('tab', tab);
		// TODO expose active index?
	}

	onDestroy(() => {
		if (tab) {
			tab.pages.forEach((p, i) => {
				tab.removePage(i);
			});
			parent?.remove(tab);
		}
		tab?.dispose();
	});
</script>

<slot />
