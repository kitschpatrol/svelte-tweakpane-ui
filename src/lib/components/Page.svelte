<script lang="ts">
	import type { Pane, TabApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onDestroy, getContext, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	export let title: string = 'Tab Page';
	export let disabled: boolean = false;
	export let selected: boolean = false;

	let page: TabPageApi | undefined;
	let tabStore: Writable<TabApi | null>;
	let parent: Pane | FolderApi | TabPageApi;

	if (typeof document !== 'undefined') {
		tabStore = getContext('tabStore');

		if (!$tabStore) {
			// create tab if necessary
			// this will be the tab's parent, not the page's
			parent = getContext('parent');

			$tabStore = parent.addTab({
				// tabs MUST be created with at least one page
				// how to handle tabs with no children?
				// could be cleaner to have children create the tab as needed?
				pages: [{ title }],
				disabled: false
			});

			page = $tabStore.pages[0];
		} else {
			// add to existing tab
			page = $tabStore.addPage({ title });
		}

		$tabStore.on('select', (e) => {
			page && (selected = page.selected);
		});

		setContext('parent', page);
	}

	onDestroy(() => {
		page?.dispose();
	});

	$: page && (page.title = title);
	$: page && (page.disabled = disabled);
	$: page && (page.selected = selected);
</script>

<slot />
