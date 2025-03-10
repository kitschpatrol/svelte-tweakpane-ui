<script context="module" lang="ts">
	export type ButtonClickEvent = CustomEvent<null>
</script>

<script lang="ts">
	import type { Theme } from '$lib/theme.js'
	import type { ButtonApi as ButtonRef } from '@tweakpane/core'
	import type { Writable } from 'svelte/store'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte'
	import {
		type Container,
		getElementIndex,
		isRootPane,
		type UnwrapCustomEvents,
	} from '$lib/utils.js'
	import { BROWSER } from 'esm-env'
	import { createEventDispatcher, getContext, onDestroy, onMount } from 'svelte'

	/**
	 * Text inside of the button.
	 * @default `'Button'`
	 * */
	export let title: string = 'Button'

	/**
	 * Text displayed next to the button.
	 * @default `undefined`
	 * */
	export let label: string | undefined = undefined

	/**
	 * Prevent interactivity and gray out the control.
	 * @default `false`
	 * */
	export let disabled: boolean = false

	/**
	 * Custom color scheme.
	 * @default `undefined`  \
	 * Inherits default Tweakpane theme equivalent to
	 * `ThemeUtils.presets.standard`, or the theme set with
	 * `setGlobalDefaultTheme()`.)
	 * */
	export let theme: Theme | undefined = undefined

	const parentStore: Writable<Container> = getContext('parentStore')
	const userCreatedPane = getContext('userCreatedPane')

	// Seems to be the only way to get event comments to work
	type $$Events = {
		/**
		 * Fires when the button is clicked.
		 * @event
		 * */
		click: ButtonClickEvent
	}

	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>()

	let indexElement: HTMLDivElement
	let button: ButtonRef
	let index: number

	function create() {
		if (button) button.dispose()

		button = $parentStore.addButton({
			disabled,
			index,
			label,
			title,
		})

		button.on('click', () => {
			// Event type? Does TpEvent with its target value make any sense? note that this event
			// must be forwarded manually...
			dispatch('click')
		})
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0
	})

	onDestroy(() => {
		button?.dispose()
	})

	$: index !== undefined && $parentStore && !button && create()
	$: button && (button.title = title)
	$: button && (button.label = label)
	$: button && (button.disabled = disabled)
	$: theme &&
		$parentStore &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Button> components for a theme prop.)',
		)
</script>

<!--
@component  
A humble but effective push button.

Wraps the Tweakpane [`addButton`](https://tweakpane.github.io/docs/ui-components/#button) method.

Usage outside of a `<Pane>` component will implicitly wrap the button in `<Pane position="inline">`.

See the `<ButtonGrid>` and `<RadioGrid>` components for a convenient way to lay out multiple
buttons.

@emits {void} click - When the button is clicked.

@example  
```svelte
<script lang="ts">
  import { Button } from 'svelte-tweakpane-ui'

  let count = 0
</script>

<Button on:click={() => count++} label="Count" title="Increment" />
<pre>Count: {count}</pre>
```

@sourceLink
[Button.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Button.svelte)
-->

{#if parentStore}
	{#if BROWSER}
		<div bind:this={indexElement} style="display: none;"></div>
	{:else}
		<ClsPad keysAdd={['containerUnitSize', 'containerVerticalPadding']} {theme} />
	{/if}
{:else}
	<InternalPaneInline {theme} userCreatedPane={false}>
		<svelte:self on:click {disabled} {label} {title} />
	</InternalPaneInline>
{/if}
