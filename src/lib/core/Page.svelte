<script lang="ts">
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import Tab from '$lib/core/Tab.svelte';
	import type { Theme } from '$lib/theme.js';
	import { getElementIndex, isRootPane, type TpContainer } from '$lib/utils.js';
	import type { TabPageApi } from '@tweakpane/core';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import type { TabApi } from 'tweakpane';

	/** Text in the tab. */
	export let title: string = 'Tab Page';

	/** Prevent interactivity. Defaults to `false`. */
	export let disabled: boolean = false;

	/** True when the page is the active tab. If multiple pages `seleted` props are set to true, the last page to be set to `true` comes to the foreground in its containing <Tab> component. Bindable. */
	export let selected: boolean = false;

	/** Custom color scheme. Only applies if the `<Page>` is created outside a `<Pane>` component. */
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
		console.log('page created');

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

			// first tab selected by default
			selected = true;
		} else if (!$tabPageStore && $tabStore) {
			// add to existing tab
			$tabPageStore = $tabStore.addPage({ title, index });
		}

		$tabStore?.on('select', () => {
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

<!--
@component
Contains a collection of Tweakpane controls to be presented as a group inside a `<Tab>` component. ("Tab" might be a more accurate description for this control.)

Provides `page` values to Tweakpane's [addTab](https://tweakpane.github.io/docs/ui-components/#tab) method.

Usage outside of a `<Tab>` component wouldn't make much sense, but in such cases the `<Page>` will be implicitly wrapped in a `<Tab>` and a `<InternalPaneInline>`.

Example:	
```tsx
<Tab>
	<Page title="A">
		<Button title="Button A" on:click={() => alert('A...')} />
	</Page>
	<Page title="B">
		<Button title="Button B" on:click={() => alert('B...')} />
	</Page>
</Tab>
```
-->

{#if BROWSER}
	{#if parentStore && tabIndexStore !== undefined}
		<div style="display: none;" bind:this={indexElement}>
			<slot />
		</div>
	{:else}
		<InternalPaneInline userCreatedPane={false} {theme}>
			<Tab>
				<!-- {...$$props} breaks types -->
				<svelte:self {title} {disabled} {selected} {theme}>
					<slot />
				</svelte:self>
			</Tab>
		</InternalPaneInline>
	{/if}
{/if}
