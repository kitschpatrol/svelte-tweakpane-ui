<script lang="ts" generics="T extends BaseBladeParams, U extends BladeApi">
	import type { Theme } from '$lib/theme.js';
	import { getElementIndex, isRootPane, stripProps, type TpContainer } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import PaneInline from '$lib/core/PaneInline.svelte';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BaseBladeParams, BladeApi } from 'tweakpane';

	/** Blade configuration exposing TweakPane's internal [BladeParams](https://tweakpane.github.io/docs/api/interfaces/BaseBladeParams.html), not generally intended for direct use.  */
	export let bladeParams: T;

	/** Prevent interactivity. */
	export let disabled: boolean = false;

	/** Custom color scheme. Only applies if the `<Blade>` is created outside a `<Pane>` component.  */
	export let theme: Theme | undefined = undefined;

	/** Bindable reference to internal TweakPane [BladeApi](https://tweakpane.github.io/docs/api/classes/BladeApi.html) for this blade, not generally intended for direct use */
	export let bladeRef: U | undefined = undefined;

	const parentStore: Writable<TpContainer> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');

	let indexElement: HTMLDivElement;
	let blade: U;
	let index: number;

	function create() {
		// must destroy to allow a reactive parameters
		if (blade) blade.dispose();

		// last one wins
		blade = $parentStore.addBlade({
			index,
			...bladeParams,
			disabled
		}) as U; // TODO hmm
		bladeRef = blade;
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		blade?.dispose();
	});

	$: bladeParams, BROWSER && $parentStore && index !== undefined && create();
	$: BROWSER && blade && (blade.disabled = disabled);
	$: BROWSER &&
		theme &&
		$parentStore &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Blade> components for a theme prop.)'
		);

	// TODO bind blade params too?
	const plainProps = stripProps($$props, 'bladeRef');
</script>

<!--
@component
Wraps the Tweakpane [addBlade](https://tweakpane.github.io/docs/blades/) method.

Usage outside of a `<Pane>` component will implicitly wrap the component in a `<PaneInline>`.
	
Tweakpane's Vanilla JS API offers Blades as as a way to create unbound components, but in Svelte the same can be achieved by simply not binding the component's value.

This component is not directly exposed since it lacks a use case in the Svelte context. Consider convenience components like `<Separator>`, etc. before using this component directly.

Example:
  ```tsx
	<Blade bladeParams={{view: 'separator'}} />
	```
	-->

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement} />
	{:else}
		<PaneInline userCreatedPane={false} {theme}>
			<svelte:self {...plainProps} bind:bladeRef />
		</PaneInline>
	{/if}
{/if}
