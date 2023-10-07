<script lang="ts">
	import PaneInline from '$lib/core/PaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import { getElementIndex, isRootPane, type TpContainer } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import type { TabApi } from 'tweakpane';

	// scoped themes don't work
	// TODO expose active index?
	export let disabled: boolean = false;
	export let selectedIndex: number = 0;
	export let theme: Theme | undefined = undefined;

	const parentStore: Writable<TpContainer> = getContext('parentStore');
	const tabStore = writable<TabApi>();
	setContext('tabStore', tabStore);
	const tabIndexStore = writable<number>();
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

	// TODO does this need cleanup?
	function setUpListeners(t: TabApi) {
		t?.on('select', (e) => {
			selectedIndex = e.index;
		});
	}

	function setSelectedIndex(index: number) {
		const tabPageApi = $tabStore?.pages.at(index);
		if (tabPageApi) {
			if (!tabPageApi.selected) tabPageApi.selected = true;
		}
	}

	$: BROWSER && setUpListeners($tabStore);
	$: BROWSER && setSelectedIndex(selectedIndex);
	$: BROWSER && $tabStore && ($tabStore.disabled = disabled);
	$: BROWSER &&
		theme &&
		$parentStore &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Tab> components for a theme prop.)'
		);
</script>

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement}>
			<slot />
		</div>
	{:else}
		<PaneInline userCreatedPane={false} {theme}>
			<svelte:self bind:selectedIndex {...$$props}>
				<slot />
			</svelte:self>
		</PaneInline>
	{/if}
{/if}
