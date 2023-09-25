<script lang="ts">
	import type { Pane as TpPane, TabApi } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onDestroy, getContext, setContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import { getElementIndex, isRootPane, type TpContainer } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import PaneInline from './PaneInline.svelte';
	import Tab from './Tab.svelte';
	import type { Theme } from '$lib/theme.js';

	export let title: string = 'Tab Page';
	export let disabled: boolean = false;
	export let selected: boolean = false;
	export let theme: Theme | undefined = undefined;

	// get context from tab
	const tabStore: Writable<TabApi> = getContext('tabStore');
	const tabIndexStore: Writable<number> = getContext('tabIndexStore');
	const userCreatedPane = getContext('userCreatedPane');

	// save parent context for ourselves
	const parentStore: Writable<TpContainer> = getContext('parentStore');

	// overwrite the context for our children
	const tabPageStore = writable<TabPageApi>();
	setContext('parentStore', tabPageStore);

	// index not actually used, page order established by array order on tab
	let indexElement: HTMLDivElement;
	let index: number;

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
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

	$: BROWSER && index !== undefined && $parentStore && $tabIndexStore !== undefined && create();
	$: BROWSER && $tabPageStore && ($tabPageStore.title = title);
	$: BROWSER && $tabPageStore && ($tabPageStore.disabled = disabled);
	$: BROWSER && $tabPageStore && ($tabPageStore.selected = selected);
	$: BROWSER &&
		theme &&
		$parentStore &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Page> components for a theme prop.)'
		);
</script>

{#if BROWSER}
	{#if parentStore && tabIndexStore !== undefined}
		<div style="display: none;" bind:this={indexElement}>
			<slot />
		</div>
	{:else}
		<PaneInline userCreatedPane={false} {theme}>
			<Tab>
				<svelte:self {...$$props}>
					<slot />
				</svelte:self>
			</Tab>
		</PaneInline>
	{/if}
{/if}
