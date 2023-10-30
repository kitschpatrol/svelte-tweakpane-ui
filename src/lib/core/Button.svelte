<script lang="ts">
	import type { ButtonApi } from '@tweakpane/core';
	import { BROWSER } from 'esm-env';
	import { createEventDispatcher, getContext, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import { getElementIndex, isRootPane, type Container } from '$lib/utils.js';

	/**
	 * Text inside of the button.
	 * @default `'Button'`
	 * */
	export let title: string = 'Button';

	/**
	 * Text displayed next to the button.
	 * @default `undefined`
	 * */
	export let label: string | undefined = undefined;

	/**
	 * Prevent interactivity. Defaults to `false`.
	 * @default `false`
	 * */
	export let disabled: boolean = false;

	/**
	 * Custom color scheme.
	 * @default `undefined` (Inherits default Tweakpane theme equivalent to `THEMES.standard`, or the theme set with `setGlobalDefaultTheme()`.)*
	 * */
	export let theme: Theme | undefined = undefined;

	const parentStore: Writable<Container> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');

	// Seems to be the only way to get event comments to work
	type $$Events = {
		/**
		 * Fires when the button is clicked.
		 * @event
		 * */
		click: null;
	};

	const dispatch = createEventDispatcher<$$Events>();

	let indexElement: HTMLDivElement;
	let button: ButtonApi;
	let index: number;

	function create() {
		// console.log('button created');

		if (button) button.dispose();

		button = $parentStore.addButton({
			title,
			label,
			disabled,
			index
		});

		button.on('click', () => {
			// Event type? Does TpEvent with its target value make any sense?
			// note that this event must be forwarded manually...
			dispatch('click');
		});
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		button?.dispose();
	});

	$: BROWSER && index !== undefined && $parentStore && !button && create();
	$: BROWSER && button && (button.title = title);
	$: BROWSER && button && (button.label = label);
	$: BROWSER && button && (button.disabled = disabled);
	$: BROWSER &&
		theme &&
		$parentStore &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Button> components for a theme prop.)'
		);
</script>

<!--
@component
A humble push button.

Wraps the Tweakpane [addButton](https://tweakpane.github.io/docs/ui-components/#button) method.

Usage outside of a `<Pane>` component will implicitly wrap the button in `<Pane position='inline'>`.

@emits {void} click - when the button is clicked

@example	
```tsx
<script lang="ts">
	import { Button } from 'svelte-tweakpane-ui';

	let count = 0;
</script>

<Button
	label="Count"
	title="Increment"
	on:click={() => count++}
/>
<pre>
	Count: {count}
</pre>
```

@sourceLink
-->

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement} />
	{:else}
		<InternalPaneInline userCreatedPane={false} {theme}>
			<svelte:self on:click {title} {label} {disabled} />
		</InternalPaneInline>
	{/if}
{/if}
