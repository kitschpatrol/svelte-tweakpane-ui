<script lang="ts">
	import type { Pane as TpPane, TabApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext, setContext } from 'svelte';
	import { getElementIndex, type TpContainer } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { BROWSER } from 'esm-env';
	import Pane from './Pane.svelte';

	// scoped themes don't work
	// TODO expose active index?
	export let disabled: boolean = false;

	const inPane = getContext('inPane');

	const parentStore: Writable<TpContainer> = getContext('parentStore');
	const tabStore = writable<TabApi>();
	setContext('tabStore', tabStore);
	const tabIndexStore = writable<Number>();
	setContext('tabIndexStore', tabIndexStore);
	const userCreatedPane = getContext('userCreatedPane');

	let indexElement: HTMLDivElement;

	onMount(() => {
		// pass the tab context and index down as a store instead of a plain
		// context, so that the child pages can edit it when needed
		// that lets us support a childless <Tab /> component, where
		// the first page to be added handles construction of the tab
		// this is necessary because the tweakpane tab API can only construct
		// tab groups with at least one page
		$tabIndexStore = userCreatedPane ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		$tabStore?.dispose();
	});

	$: BROWSER && $tabStore && ($tabStore.disabled = disabled);
</script>

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement}>
			<slot />
		</div>
	{:else}
		<Pane title="tab created pane" userCreatedPane={false}>
			<svelte:self {...$$props}>
				<slot />
			</svelte:self>
		</Pane>
	{/if}
{/if}
