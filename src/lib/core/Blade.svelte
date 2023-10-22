<script lang="ts" context="module">
	import type { BaseBladeParams, BladeApi } from 'tweakpane';
	export type BladeOptions = BaseBladeParams;
	export type BladeRef = BladeApi; // required for input folding
</script>

<script lang="ts" generics="U extends BladeOptions, V extends BladeRef">
	import type { Theme } from '../theme.js';
	import { getElementIndex, isRootPane, type Container, type Plugin } from '../utils.js';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import InternalPaneInline from '../internal/InternalPaneInline.svelte';

	/** Blade configuration exposing TweakPane's internal [BladeParams](https://tweakpane.github.io/docs/api/interfaces/BaseBladeParams.html), not generally intended for direct use. */
	export let options: U;

	/** Prevent interactivity. Defaults to `false`. */
	export let disabled: boolean = false;

	/** Custom color scheme. Only applies if the `<Blade>` is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;

	/** Bindable reference to internal TweakPane [BladeApi](https://tweakpane.github.io/docs/api/classes/BladeApi.html) for this blade, not generally intended for direct use */
	export let ref: V | undefined = undefined;

	/** Imported Tweakpane `TpPluginBundle` module to register before creating the blade. Primarily for internal use. */
	export let plugin: Plugin | undefined = undefined;

	const registerPlugin = getContext<(plugin: Plugin) => void>('registerPlugin');
	const parentStore: Writable<Container> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');

	let indexElement: HTMLDivElement;
	let blade: V;
	let index: number;

	function create() {
		console.log('blade created');

		// must destroy to allow reactive parameters
		if (blade) blade.dispose();

		if (plugin !== undefined) {
			// calls function provided by context on the containing pane
			registerPlugin(plugin);
		}

		// last one wins
		blade = $parentStore.addBlade({
			index,
			...options,
			disabled
		}) as V; // todo can't shake ts(2322);
		ref = blade;
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		blade?.dispose();
	});

	$: options, BROWSER && $parentStore && index !== undefined && create();
	$: BROWSER && blade && (blade.disabled = disabled);
	$: BROWSER &&
		theme &&
		$parentStore &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Blade> components for a theme prop.)'
		);
</script>

<!--
@component
Wraps the Tweakpane [addBlade](https://tweakpane.github.io/docs/blades/) method.

Usage outside of a `<Pane>` component will implicitly wrap the component in `<Pane position='inline'>`.
	
Tweakpane's Vanilla JS API offers Blades as as a way to create unbound components, but in Svelte the same can be achieved by simply not binding the component's value.

This component is not directly exposed since it lacks a use case in the Svelte context. Consider convenience components like `<Separator>`, etc. before using this component directly.

Example:
```tsx
<Blade options={{view: 'separator'}} />
```
-->

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement} />
	{:else}
		<InternalPaneInline userCreatedPane={false} {theme}>
			<!-- Everything must be manually bound instead of spreading props due to lack of access to blade  -->
			<svelte:self bind:disabled bind:ref bind:options bind:plugin />
		</InternalPaneInline>
	{/if}
{/if}
