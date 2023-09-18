<script lang="ts">
	import type { Pane, TabApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import { getElementIndex } from './utils.js';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';

	// TODO expose active index?

	export let disabled: boolean = false;

	const parentStore: Writable<Pane | FolderApi | TabPageApi | undefined> =
		getContext('parentStore');
	const tabStore = writable<TabApi | undefined>(undefined);
	setContext('tabStore', tabStore);
	const tabIndexStore = writable<Number | undefined>(undefined);
	setContext('tabIndexStore', tabIndexStore);

	let indexElement: HTMLDivElement;

	onMount(() => {
		// pass the tab context and index down as a store instead of a plain
		// context, so that the child pages can edit it when needed
		// that lets us support a childless <Tab /> component, where
		// the first page to be added handles construction of the tab
		// this is necessary because the tweakpane tab API can only construct
		// tab groups with at least one page
		$tabIndexStore = getElementIndex(indexElement);
	});

	function create() {
		// nothing to do here, happens in page
	}

	function destroy() {
		if ($tabStore) {
			$parentStore?.remove($tabStore);
			$tabStore.dispose();
		}
	}

	onDestroy(() => {
		destroy();
	});

	$: $tabIndexStore !== undefined && create();
	$: $tabStore && ($tabStore.disabled = disabled);
</script>

<div style="display: none;" bind:this={indexElement}>
	<slot />
</div>
