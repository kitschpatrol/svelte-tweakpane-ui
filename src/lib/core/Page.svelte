<script lang="ts">
	import type { TabPageApi as TabPageRef } from '@tweakpane/core';
	import Tab from '$lib/core/Tab.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import { type Container, getElementIndex, isRootPane } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import type { TabApi as TabRef } from 'tweakpane';

	/**
	 * Text in the tab.
	 * @default `'Tab Page'`
	 * */
	export let title: string = 'Tab Page';

	/**
	 * Prevent interactivity.
	 * @default `false`
	 * */
	export let disabled: boolean = false;

	/**
	 * True when the page is the active tab.
	 * @default `false`
	 * @bindable
	 * */
	export let selected: boolean = false;

	/**
	 * Custom color scheme.
	 * @default `undefined`  \
	 * Inherits default Tweakpane theme equivalent to `THEMES.standard`, or the theme set with
	 * `setGlobalDefaultTheme()`.)
	 * */
	export let theme: Theme | undefined = undefined;

	// get context from tab
	const tabStore: Writable<TabRef> = getContext('tabStore');
	const tabIndexStore: Writable<number> = getContext('tabIndexStore');
	const userCreatedPane = getContext('userCreatedPane');

	// save parent context for ourselves
	const parentStore: Writable<Container> = getContext('parentStore');

	// overwrite the context for our children
	const tabPageStore = writable<TabPageRef>();
	setContext('parentStore', tabPageStore);

	// index not actually used, page order established by array order on tab
	let indexElement: HTMLDivElement;
	let index: number;

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	function create() {
		// console.log('page created');

		if (!$tabStore) {
			// create tab if necessary this will be the tab's parent, not the page's
			$tabStore = $parentStore.addTab({
				// tabs MUST be created with at least one page how to handle tabs with no children?
				disabled: false,
				index: $tabIndexStore,
				// could be cleaner to have children create the tab as needed?
				pages: [{ title }]
			});

			$tabPageStore = $tabStore.pages[0];

			// first tab selected by default
			selected = true;
		} else if (!$tabPageStore && $tabStore) {
			// add to existing tab
			$tabPageStore = $tabStore.addPage({ index, title });
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
Contains a collection of Tweakpane controls to be presented as a group inside a `<Tab>` component.
("Tab" might be a more accurate description for this control.)

Provides `page` values to Tweakpane's [addTab](https://tweakpane.github.io/docs/ui-components/#tab)
method.

Usage outside of a `<Tab>` component wouldn't make much sense, but in such cases the `<Page>` will
be implicitly wrapped in a `<Tab>` and `<Pane position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { Button, Page, Tab } from 'svelte-tweakpane-ui';

  let countA = 0;
  let countB = 0;
</script>

<Tab>
  <Page title="A">
    <Button on:click={() => countA++} title="Button A" />
  </Page>
  <Page title="B">
    <Button on:click={() => countB++} title="Button B" />
  </Page>
</Tab>

<pre>
Count A: {countA}
Count B: {countB}
</pre>
```

@sourceLink
[Page.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/core/Page.svelte)
-->

{#if BROWSER}
	{#if parentStore && tabIndexStore !== undefined}
		<div bind:this={indexElement} style="display: none;">
			<slot />
		</div>
	{:else}
		<InternalPaneInline {theme} userCreatedPane={false}>
			<Tab>
				<!-- {...$$props} breaks types -->
				<svelte:self {disabled} {selected} {theme} {title}>
					<slot />
				</svelte:self>
			</Tab>
		</InternalPaneInline>
	{/if}
{/if}
