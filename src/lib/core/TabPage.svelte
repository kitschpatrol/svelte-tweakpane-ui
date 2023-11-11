<script lang="ts">
	import type { TabPageApi as TabPageRef } from '@tweakpane/core';
	import TabGroup from '$lib/core/TabGroup.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import { type Container, getElementIndex, isRootPane } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import type { TabApi as TabGroupRef } from 'tweakpane';

	/**
	 * Text in the tab.
	 * @default `'Tab Page'`
	 * */
	export let title: string = 'Tab Page';

	/**
	 * Prevent interactivity and gray out the control.
	 * @default `false`
	 * */
	export let disabled: boolean = false;

	/**
	 * Sets the page is the active tab.
	 *
	 * When `bound` it will indicate whether the tab is active.
	 * @default `false`
	 * @bindable
	 * */
	export let selected: boolean = false;

	/**
	 * Custom color scheme.
	 * @default `undefined`  \
	 * Inherits default Tweakpane theme equivalent to `ThemeUtils.presets.standard`, or the theme
	 * set with `setGlobalDefaultTheme()`.)
	 * */
	export let theme: Theme | undefined = undefined;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Slots = {
		/**
		 * Any Tweakpane component, except a `<Pane>`.
		 */
		default: {};
	};

	// get context from tab
	const tabGroupStore: Writable<TabGroupRef> = getContext('tabGroupStore');
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

		if (!$tabGroupStore) {
			// create tab if necessary this will be the tab's parent, not the page's
			$tabGroupStore = $parentStore.addTab({
				// tabs MUST be created with at least one page how to handle tabs with no children?
				disabled: false,
				index: $tabIndexStore,
				// could be cleaner to have children create the tab as needed?
				pages: [{ title }]
			});

			$tabPageStore = $tabGroupStore.pages[0];

			// first tab selected by default
			selected = true;
		} else if (!$tabPageStore && $tabGroupStore) {
			// add to existing tab
			$tabPageStore = $tabGroupStore.addPage({ index, title });
		}

		$tabGroupStore?.on('select', () => {
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
			'Set theme on the <Pane> component, not on its children! (Check nested <TabPage> components for a theme prop.)'
		);
</script>

<!--
@component  
Contains a collection of Tweakpane controls to be presented as a single group inside a `<TabGroup>`
component.

Provides `page` values to Tweakpane's [addTab](https://tweakpane.github.io/docs/ui-components/#tab)
method.

The name of this concept within the underlying vanilla JS Tweakpane API is `page`, but it has been
changed to `TabPage` in `svelte-tweakpane-ui` for clarity its relationship to the `<TabGroup>`
component.

Usage outside of a `<TabGroup>` component wouldn't make much sense, but in such cases the
`<TabPage>` will be implicitly wrapped in a `<TabGroup>` and `<Pane position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { Button, TabGroup, TabPage } from 'svelte-tweakpane-ui';

  let countA = 0;
  let countB = 0;
</script>

<TabGroup>
  <TabPage title="A">
    <Button on:click={() => countA++} title="Button A" />
  </TabPage>
  <TabPage title="B">
    <Button on:click={() => countB++} title="Button B" />
  </TabPage>
</TabGroup>

<pre>
Count A: {countA}
Count B: {countB}
</pre>
```

@sourceLink
[TabPage.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/core/TabPage.svelte)
-->

{#if BROWSER}
	{#if parentStore && tabIndexStore !== undefined}
		<div bind:this={indexElement} style="display: none;">
			<slot />
		</div>
	{:else}
		<InternalPaneInline {theme} userCreatedPane={false}>
			<TabGroup>
				<svelte:self {disabled} {selected} {theme} {title}>
					<slot />
				</svelte:self>
			</TabGroup>
		</InternalPaneInline>
	{/if}
{/if}
