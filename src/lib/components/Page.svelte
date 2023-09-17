<script lang="ts">
	import type { Pane, TabApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onDestroy, getContext, setContext } from 'svelte';

	export let title: string = 'Tab Page';

	let page: TabPageApi | undefined;
	let tab: TabApi;
	let parent: Pane | FolderApi | TabPageApi;

	if (typeof document !== 'undefined') {
		tab = getContext('tab');

		console.log('adding page!');
		console.log('adding page!');
		page = tab.addPage({ title });
		setContext('parent', page);

		// clean up the placeholder, if applicable...
		// TODO do this in parent?
		const placeholderPageIndex = tab.pages.findIndex((p) => {
			// TODO DRY
			return p.title === 'Add <Page> child components to this <Tab>!';
		});

		if (placeholderPageIndex >= 0) {
			console.log('removing placeholder page!');
			tab.removePage(placeholderPageIndex);
		}
	}

	onDestroy(() => {
		page?.dispose();
	});

	$: page && (page.title = title);
</script>

<slot />
