<script lang="ts">
	import type { TabApi as TabGroupRef } from 'tweakpane'
	import { BROWSER } from 'esm-env'
	import { getContext, onDestroy, onMount, setContext } from 'svelte'
	import { writable, type Writable } from 'svelte/store'
	import type { Theme } from '$lib/theme.js'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte'
	import { type Container, getElementIndex, isRootPane } from '$lib/utils.js'

	/**
	 * Prevent interactivity and gray out the control.
	 * @default `false`
	 */
	export let disabled: boolean = false

	/**
	 * Active page index.
	 *
	 * Note that SSR will always render the first page height, regardless of the initial active
	 * index.
	 * @default `0`
	 * @bindable
	 */
	export let selectedIndex: number = 0

	/**
	 * Custom color scheme.
	 * @default `undefined`  \
	 * Inherits default Tweakpane theme equivalent to `ThemeUtils.presets.standard`, or the theme
	 * set with `setGlobalDefaultTheme()`.
	 */
	export let theme: Theme | undefined = undefined

	type $$Slots = {
		/**
		 * A `<TabPage>` component.
		 */
		default: {}
	}

	const parentStore: Writable<Container> = getContext('parentStore')

	const tabGroupStore = writable<TabGroupRef>()
	setContext('tabGroupStore', tabGroupStore)

	const tabIndexStore = writable<number>()
	setContext('tabIndexStore', tabIndexStore)

	const userCreatedPane = getContext('userCreatedPane')

	let indexElement: HTMLDivElement

	onMount(() => {
		// Pass the tab context and index down as a store instead of a plain context, so that the
		// child pages can edit it when needed that lets us support a childless <TabGroup />
		// component, where the first page to be added handles construction of the tab this is
		// necessary because the tweakpane tab API can only construct tab groups with at least one
		// page
		$tabIndexStore = userCreatedPane ? getElementIndex(indexElement) : 0
	})

	onDestroy(() => {
		$tabGroupStore?.dispose()
	})

	// TODO does this need cleanup?
	function setUpListeners(t: TabGroupRef) {
		t?.on('select', (event) => {
			selectedIndex = event.index
		})
	}

	function setSelectedIndex(index: number) {
		const tabPageApi = $tabGroupStore?.pages.at(index)
		if (tabPageApi && !tabPageApi.selected) tabPageApi.selected = true
	}

	$: setUpListeners($tabGroupStore)
	$: setSelectedIndex(selectedIndex)
	$: $tabGroupStore && ($tabGroupStore.disabled = disabled)
	$: theme &&
		$parentStore &&
		(userCreatedPane ?? !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <TabGroup> components for a theme prop.)',
		)
</script>

<!--
@component  
Contains a collection of `<TabPage>` components to be presented as a tabs.

Wrapper around Tweakpane's [`addTab`](https://tweakpane.github.io/docs/ui-components/#tab) method.

The name of this concept within the underlying vanilla JS Tweakpane API is `tab`, but it has been
changed to `TabGroup` in _Svelte Tweakpane UI_ to clarify it's relationship to the `<TabPage>`
component.

Usage outside of a `<Pane>` component will implicitly wrap the tab in `<Pane position="inline">`.

@example  
```svelte
<script lang="ts">
  import { Button, TabGroup, TabPage } from 'svelte-tweakpane-ui'
</script>

<TabGroup>
  <TabPage title="A">
    <Button on:click={() => alert('A...')} title="Button A" />
  </TabPage>
  <TabPage title="B">
    <Button on:click={() => alert('B...')} title="Button B" />
  </TabPage>
</TabGroup>
```

@sourceLink
[TabGroup.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/core/TabGroup.svelte)
-->

{#if parentStore}
	{#if BROWSER}
		<div bind:this={indexElement} style="display: none;">
			<slot />
		</div>
	{:else}
		<ClsPad keysAdd={['containerVerticalPadding', 'containerVerticalPadding']} {theme} />
		<div>
			<slot />
		</div>
	{/if}
{:else}
	<InternalPaneInline {theme} userCreatedPane={false}>
		<svelte:self bind:selectedIndex {disabled}>
			<slot />
		</svelte:self>
	</InternalPaneInline>
{/if}
