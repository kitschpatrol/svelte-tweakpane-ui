<script lang="ts">
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import { getElementIndex, isRootPane, type Container } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import type { TabApi as TabRef } from 'tweakpane';

	/**
	 * Prevent interactivity.
	 * @default `false`
	 * */
	export let disabled: boolean = false;

	/**
	 * Active page index.
	 * @default `0`
	 * @bindable
	 * */
	export let selectedIndex: number = 0;

	/**
	 * Custom color scheme.
	 * @default `undefined` (Inherits default Tweakpane theme equivalent to `THEMES.standard`, or the theme set with `setGlobalDefaultTheme()`.)
	 * */
	export let theme: Theme | undefined = undefined;

	const parentStore: Writable<Container> = getContext('parentStore');

	const tabStore = writable<TabRef>();
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
	function setUpListeners(t: TabRef) {
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

<!--
@component
Contains a collection of `<Page>` components to be presented as a tabs. ("TabGroup" might be a more accurate description for this control.)

Wraps Tweakpane's [addTab](https://tweakpane.github.io/docs/ui-components/#tab) method.

Usage outside of a `<Pane>` component will implicitly wrap the tab in `<Pane position='inline'>`.

@example	
```tsx
<script lang="ts">
	import { Tab, Page, Button } from 'svelte-tweakpane-ui';
</script>

<Tab>
	<Page title="A">
		<Button title="Button A" on:click={() => alert('A...')} />
	</Page>
	<Page title="B">
		<Button title="Button B" on:click={() => alert('B...')} />
	</Page>
</Tab>
```

@sourceLink
-->

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement}>
			<slot />
		</div>
	{:else}
		<InternalPaneInline userCreatedPane={false} {theme}>
			<!--  {...$$props}> breaks types -->
			<svelte:self bind:selectedIndex {disabled}>
				<slot />
			</svelte:self>
		</InternalPaneInline>
	{/if}
{/if}
