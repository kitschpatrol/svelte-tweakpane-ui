<script lang="ts">
	import type { Pane as TpPane, TabApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import { getElementIndex } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { BROWSER } from 'esm-env';
	import Pane from './Pane.svelte';

	// TODO expose active index?

	export let disabled: boolean = false;
	// scoped themes don't work
	const inPane = getContext('inPane');

	if (BROWSER && !inPane) {
		console.warn('Tweakpane Tabs must be used inside of a <Pane>');
	}

	const parentStore: Writable<TpPane | FolderApi | TabPageApi> = getContext('parentStore');
	const tabStore = writable<TabApi>();
	setContext('tabStore', tabStore);
	const tabIndexStore = writable<Number>();
	setContext('tabIndexStore', tabIndexStore);

	let indexElement: HTMLDivElement;
	let paneRef: TpPane;

	onMount(() => {
		// pass the tab context and index down as a store instead of a plain
		// context, so that the child pages can edit it when needed
		// that lets us support a childless <Tab /> component, where
		// the first page to be added handles construction of the tab
		// this is necessary because the tweakpane tab API can only construct
		// tab groups with at least one page
		$tabIndexStore = getElementIndex(indexElement);
	});

	onDestroy(() => {
		$tabStore?.dispose();
	});

	$: $tabStore && ($tabStore.disabled = disabled);
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
