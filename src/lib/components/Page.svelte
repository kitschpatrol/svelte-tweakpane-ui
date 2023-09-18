<script lang="ts">
	import type { Pane, TabApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onDestroy, getContext, setContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { getElementIndex } from './utils.js';

	export let title: string = 'Tab Page';
	export let disabled: boolean = false;
	export let selected: boolean = false;

	// get context from tab
	const tabStore: Writable<TabApi | undefined> = getContext('tabStore');
	const tabIndexStore: Writable<number | undefined> = getContext('tabIndexStore');

	// save parent context for ourselves
	const parentStore: Writable<Pane | FolderApi | TabPageApi | undefined> =
		getContext('parentStore');

	// overwrite the context for our children
	const tabPageStore = writable<TabPageApi | undefined>(undefined);
	setContext('parentStore', tabPageStore);

	// index not actually used, page order established by array order on tab
	let indexElement: HTMLDivElement;
	let index: number;

	onMount(() => {
		index = getElementIndex(indexElement);
	});

	function create() {
		if (!$tabStore && $parentStore) {
			// create tab if necessary
			// this will be the tab's parent, not the page's
			$tabStore = $parentStore.addTab({
				// tabs MUST be created with at least one page
				// how to handle tabs with no children?
				// could be cleaner to have children create the tab as needed?
				pages: [{ title }],
				disabled: false,
				index: $tabIndexStore
			});

			$tabPageStore = $tabStore.pages[0];
		} else if (!$tabPageStore && $tabStore) {
			// add to existing tab
			$tabPageStore = $tabStore.addPage({ title, index });
		}

		$tabStore?.on('select', (e) => {
			$tabPageStore && (selected = $tabPageStore.selected);
		});
	}

	function destroy() {
		$tabPageStore?.dispose();
	}

	onDestroy(() => {
		destroy();
	});

	$: index !== undefined && $parentStore && $tabIndexStore && create();
	$: $tabPageStore && ($tabPageStore.title = title);
	$: $tabPageStore && ($tabPageStore.disabled = disabled);
	$: $tabPageStore && ($tabPageStore.selected = selected);
</script>

<div style="display: none;" bind:this={indexElement}>
	<slot />
</div>
