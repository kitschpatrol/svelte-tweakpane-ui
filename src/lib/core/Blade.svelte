<script context="module" lang="ts">
	import type { BaseBladeParams, BladeApi } from 'tweakpane';
	export type BladeRef = BladeApi; // required for input folding
	export type BladeOptions = BaseBladeParams;
	export type { Plugin } from '$lib/utils.js';
</script>

<script generics="U extends BladeOptions, V extends BladeRef" lang="ts">
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { Theme } from '$lib/theme.js';
	import {
		type Container,
		type Plugin,
		enforceReadonly,
		getElementIndex,
		isRootPane
	} from '$lib/utils.js';
	import { BROWSER, DEV } from 'esm-env';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';

	/**
	 * Blade configuration exposing Tweakpane's internal
	 * [BladeParams](https://tweakpane.github.io/docs/api/interfaces/BaseBladeParams.html).
	 *
	 * */
	export let options: U;

	/**
	 * Prevent interactivity and gray out the control.
	 * @default `false`
	 * */
	export let disabled: boolean = false;

	/**
	 * Custom color scheme.
	 * @default `undefined`  \
	 * Inherits default Tweakpane theme equivalent to `ThemeUtils.presets.standard`, or the theme
	 * set with `setGlobalDefaultTheme()`.
	 * */
	export let theme: Theme | undefined = undefined;

	/**
	 * Reference to internal Tweakpane
	 * [BladeApi](https://tweakpane.github.io/docs/api/classes/BladeApi.html) for this blade.
	 *
	 * This is primarily for internal use, when implementing convenience components wrapping Blade's
	 * functionality.
	 * @bindable
	 * @readonly
	 * */
	export let ref: V | undefined = undefined;

	/**
	 * Imported Tweakpane `TpPluginBundle` (Aliased as `Plugin`) module to register before creating
	 * the blade.
	 *
	 * This is primarily for internal use, when implementing convenience components wrapping Blade's
	 * functionality in combination with a Tweakpane plugin.
	 * @default `undefined`
	 * */
	export let plugin: Plugin | undefined = undefined;

	const registerPlugin = getContext<(plugin: Plugin) => void>('registerPlugin');
	const parentStore: Writable<Container> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');

	let indexElement: HTMLDivElement;
	let index: number;
	let _ref: V; // readonly shadow

	function create() {
		// console.log('blade created');

		// must destroy to allow reactive parameters
		if (_ref) _ref.dispose();

		if (plugin !== undefined) {
			// calls function provided by context on the containing pane
			registerPlugin(plugin);
		}

		// last one wins
		_ref = $parentStore.addBlade({
			index,
			...options,
			disabled // why last?
		}) as V; // cast is required by Tweakpane's design

		ref = _ref;
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		_ref?.dispose();
	});

	// readonly props
	$: DEV && BROWSER && enforceReadonly(_ref, ref, 'Blade', 'ref', true);

	$: options, BROWSER && $parentStore && index !== undefined && create();
	$: BROWSER && _ref && (_ref.disabled = disabled);
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

Important: This component is provided for consistency with Tweakpane's API, but is not recommended
for general use in `svelte-tweakpane-ui` because more helpful abstractions are available.

Please consider convenience components like `<Separator>`, etc. before using this component
directly.

Usage outside of a `<Pane>` component will implicitly wrap the component in `<Pane
position='inline'>`.

Tweakpane's vanilla JS API offers Blades as as a way to create unbound components, but in Svelte the
same is achieved by simply not binding the component's value.

In the example, a `<Separator>` component would be preferred over `<Blade>`, and would  obviate the
need for the options param.

@example  
```svelte
<script lang="ts">
  import { Blade } from 'svelte-tweakpane-ui';
</script>

<Blade options={{ view: 'separator' }} />
```

@sourceLink
[Blade.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/core/Blade.svelte)
-->

{#if parentStore}
	{#if BROWSER}
		<div bind:this={indexElement} style="display: none;" />
	{:else}
		<ClsPad keysAdd={['containerVerticalPadding']} {theme} />
	{/if}
{:else}
	<InternalPaneInline {theme} userCreatedPane={false}>
		<svelte:self bind:disabled bind:options bind:plugin bind:ref />
	</InternalPaneInline>
{/if}
