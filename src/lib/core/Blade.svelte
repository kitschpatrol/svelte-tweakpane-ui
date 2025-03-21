<script context="module" lang="ts">
	import type { BaseBladeParams, BladeApi } from 'tweakpane'
	export type BladeRef = BladeApi // Required for input folding
	export type BladeOptions = BaseBladeParams
	export type { Plugin } from '$lib/utils.js'
</script>

<script generics="U extends BladeOptions, V extends BladeRef" lang="ts">
	import type { Theme } from '$lib/theme.js'
	import type { Writable } from 'svelte/store'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte'
	import {
		type Container,
		enforceReadonly,
		getElementIndex,
		isRootPane,
		type Plugin,
	} from '$lib/utils.js'
	import { BROWSER, DEV } from 'esm-env'
	import { getContext, onDestroy, onMount } from 'svelte'

	/**
	 * Blade configuration exposing Tweakpane's internal
	 * [`BladeParams`](https://tweakpane.github.io/docs/api/interfaces/BaseBladeParams.html).
	 *
	 * */
	export let options: U

	/**
	 * Prevent interactivity and gray out the control.
	 * @default `false`
	 * */
	export let disabled: boolean = false

	/**
	 * Custom color scheme.
	 * @default `undefined`  \
	 * Inherits default Tweakpane theme equivalent to `ThemeUtils.presets.standard`, or the theme
	 * set with `setGlobalDefaultTheme()`.
	 * */
	export let theme: Theme | undefined = undefined

	/**
	 * Reference to internal Tweakpane
	 * [`BladeApi`](https://tweakpane.github.io/docs/api/classes/BladeApi.html) for this blade.
	 *
	 * This property is exposed for advanced use cases only, such as when implementing convenience
	 * components wrapping `<Blade>`'s functionality.
	 *
	 * Direct manipulation of Tweakpane's internals can break _Svelte Tweakpane UI_ abstractions.
	 *
	 * @bindable
	 * @readonly
	 * */
	export let ref: undefined | V = undefined

	/**
	 * Imported Tweakpane `TpPluginBundle` (aliased as `Plugin`) module to automatically register in
	 * the `<Blade>`'s containing `<Pane>`.
	 *
	 * This property is exposed for advanced use cases only, such as when implementing convenience
	 * components wrapping `<Blade>`'s functionality in combination with a Tweakpane plugin.
	 *
	 * Direct manipulation of Tweakpane's internals can break _Svelte Tweakpane UI_ abstractions.
	 *
	 * @default `undefined`
	 * */
	export let plugin: Plugin | undefined = undefined

	const registerPlugin = getContext<(plugin: Plugin) => void>('registerPlugin')
	const parentStore: Writable<Container> = getContext('parentStore')
	const userCreatedPane = getContext('userCreatedPane')

	let indexElement: HTMLDivElement
	let index: number
	let _ref: V // Readonly shadow

	function create() {
		// Must destroy to allow reactive parameters
		if (_ref) _ref.dispose()

		if (plugin !== undefined) {
			// Calls function provided by context on the containing pane
			registerPlugin(plugin)
		}

		// Last one wins
		_ref = $parentStore.addBlade({
			index,
			...options,
			disabled, // Why last?
		}) as V // Cast is required by Tweakpane's design

		ref = _ref
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0
	})

	onDestroy(() => {
		_ref?.dispose()
	})

	// Readonly props
	$: DEV && enforceReadonly(_ref, ref, 'Blade', 'ref', true)

	$: options && $parentStore && index !== undefined && create()
	$: _ref && (_ref.disabled = disabled)
	$: theme &&
		$parentStore &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Blade> components for a theme prop.)',
		)
</script>

<!--
@component  
Wraps the Tweakpane [`addBlade`](https://tweakpane.github.io/docs/blades/) method.

Important: This component is provided for consistency with Tweakpane's API, but is not recommended
for general use in _Svelte Tweakpane UI_ because more helpful abstractions are available.

Please consider convenience components like `<Separator>`, etc. before using this component
directly.

Usage outside of a `<Pane>` component will implicitly wrap the component in `<Pane
position="inline">`.

Tweakpane's vanilla JS API offers Blades as as a way to create unbound components, but in Svelte the
same is achieved by simply not binding the component's value.

In the example, a `<Separator>` component would be preferred over `<Blade>`, and would  obviate the
need for the options param.

@example  
```svelte
<script lang="ts">
  import { Blade } from 'svelte-tweakpane-ui'
</script>

<Blade
  options={{
    view: 'separator',
  }}
/>
```

@sourceLink
[Blade.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/core/Blade.svelte)
-->

{#if parentStore}
	{#if BROWSER}
		<div bind:this={indexElement} style="display: none;"></div>
	{:else}
		<ClsPad keysAdd={['containerVerticalPadding']} {theme} />
	{/if}
{:else}
	<InternalPaneInline {theme} userCreatedPane={false}>
		<svelte:self bind:disabled bind:options bind:plugin bind:ref />
	</InternalPaneInline>
{/if}
