<script lang="ts">
	import type { Pane as TpPane, TabApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onDestroy, getContext, setContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { getElementIndex } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import Pane from './Pane.svelte';

	export let title: string = 'Tab Page';
	export let disabled: boolean = false;
	export let selected: boolean = false;
	// scoped themes don't work

	// get context from tab
	const tabStore: Writable<TabApi> = getContext('tabStore');
	const tabIndexStore: Writable<number> = getContext('tabIndexStore');
	const inPane = getContext('inPane');

	if (BROWSER && (!tabStore || !inPane)) {
		console.warn('Tweakpane Pages must be used inside of a <Tab> inside of a <Pane>');
	}

	// save parent context for ourselves
	const parentStore: Writable<TpPane | FolderApi | TabPageApi> = getContext('parentStore');

	// overwrite the context for our children
	const tabPageStore = writable<TabPageApi>();
	setContext('parentStore', tabPageStore);

	// index not actually used, page order established by array order on tab
	let indexElement: HTMLDivElement;
	let index: number;
	let paneRef: TpPane;

	onMount(() => {
		index = getElementIndex(indexElement);
	});

	function create() {
		if (!$tabStore) {
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

	onDestroy(() => {
		$tabPageStore?.dispose();
	});

	$: index !== undefined && $parentStore && $tabIndexStore && create();
	$: $tabPageStore && ($tabPageStore.title = title);
	$: $tabPageStore && ($tabPageStore.disabled = disabled);
	$: $tabPageStore && ($tabPageStore.selected = selected);
	$: if (paneRef !== undefined) $parentStore = paneRef;
</script>

{#if !inPane}
	<Pane bind:paneRef>
		<div style="display: none;" bind:this={indexElement}>
			<slot />
		</div>
	</Pane>
{:else}
	<div style="display: none;" bind:this={indexElement}>
		<slot />
	</div>
{/if}
