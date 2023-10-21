<script lang="ts">
	import InternalPaneInline from '../internal/InternalPaneInline.svelte';
	import type { Theme } from '../theme.js';
	import { getElementIndex, isRootPane, type TpContainer } from '../utils.js';
	import type { ButtonApi } from '@tweakpane/core';
	import { BROWSER } from 'esm-env';
	import { createEventDispatcher, getContext, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	/** Text inside of the button */
	export let title: string = 'Button';

	/** Text displayed next to the button */
	export let label: string | undefined = undefined;

	/** Prevent interactivity. Defaults to `false`. */
	export let disabled: boolean = false;

	/** Custom color scheme. Only applies if the `<Button>` is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;

	const parentStore: Writable<TpContainer> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');
	const dispatch = createEventDispatcher<{ click: null }>();

	let indexElement: HTMLDivElement;
	let button: ButtonApi;
	let index: number;

	function create() {
		console.log('button created');

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

Usage outside of a `<Pane>` component will implicitly wrap the button in `<Pane position="inline">`.

Example:	
  ```tsx
	<Button
		label="Spline Status"
		title="Check"
		on:click={() => alert('Reticulation in progress...')}
	/>
	```
-->

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement} />
	{:else}
		<InternalPaneInline userCreatedPane={false} {theme}>
			<!-- Doesn't seem to suffer from spread props recration issue... -->
			<!-- Spreading $$props breaks types -->
			<svelte:self on:click {title} {label} {disabled} />
		</InternalPaneInline>
	{/if}
{/if}
