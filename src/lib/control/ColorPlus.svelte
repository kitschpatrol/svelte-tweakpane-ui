<script context="module" lang="ts">
	import type { ColorPlusValue } from 'tweakpane-plugin-color-plus/lite'
	import type { ValueChangeEvent } from '$lib/utils.js'
	export type { ColorPlusValue } from 'tweakpane-plugin-color-plus/lite'
	export type ColorPlusChangeEvent = ValueChangeEvent<ColorPlusValue>
</script>

<script lang="ts">
	import type { ComponentProps } from 'svelte'
	import type { InputBindingApi as ColorPlusRef } from 'tweakpane'
	import type { ColorPlusInputParams as ColorPlusOptions } from 'tweakpane-plugin-color-plus/lite'
	import { BROWSER } from 'esm-env'
	import * as pluginModule from 'tweakpane-plugin-color-plus/lite'
	import { ColorPlusModel } from 'tweakpane-plugin-color-plus/lite'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte'
	import { fillWith } from '$lib/utils.js'

	type $$Props = Omit<
		ComponentProps<GenericInputFolding<ColorPlusValue, ColorPlusOptions>>,
		'buttonClass' | 'options' | 'plugin' | 'ref'
	> & {
		/**
		 * A color value to control.
		 *
		 * Use either a color-like string (e.g. #ff00ff), a number, an object with `r`, `b`, `g`, and
		 * optional `a` keys, or a tuple.
		 * @bindable
		 */
		value: ColorPlusValue
		/**
		 * Whether to treat values as floats from 0.0 to 1.0, or integers from 0 to 255.
		 * @default `'int'`
		 */
		type?: 'float' | 'int'
	}

	// Must redeclare for bindability
	export let value: $$Props['value']
	export let expanded: $$Props['expanded'] = undefined
	export let type: $$Props['type'] = undefined

	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 * @extends ValueChangeEvent
		 * @event
		 */
		change: ColorPlusChangeEvent
	}

	let options: ColorPlusOptions
	let ref: ColorPlusRef

	// Work-around for funky folding
	const buttonClass = 'tp-colswv_b'

	// TODO do we need to expose and set an explicit alpha prop?
	// Implicit alpha seems to work fine?
	$: options = {
		color: {
			type,
		},
		view: 'color-plus',
	}
</script>

<!--
@component  

A color picker with support for additional color value formats.

Integrates the color control from the [Color Plus
plugin](https://github.com/kitschpatrol/tweakpane-plugin-color-plus).

This component looks just like the Tweakpane-native `<Color>` control, but
it adds support for all [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) color string formats as well as a
wider range of color object keys.

The plugin on which `<ColorPlus>` is based is still under active development, but can generally be used as a drop-in replacement for the `Color` control. Please report any issues you might encountered.

`<ColorPlus>` might replace the `<Color>` control entirely in the next major version of `svelte-tweakpane-ui`.

Usage outside of a `<Pane>` component will implicitly wrap the color picker in `<Pane
position="inline">`.

@emits {ColorPlusChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import { ColorPlus } from 'svelte-tweakpane-ui'

  let startColor = 'oklch(93.7% 0.199 105deg / 1)'
  let endColor = 'oklch(70.2% 0.322 328deg / 1)'
</script>

<ColorPlus bind:value={startColor} label="Start Color" />
<ColorPlus bind:value={endColor} label="End Color" />

<div class="demo" style:--a={startColor} style:--b={endColor}></div>

<style>
  .demo {
    aspect-ratio: 1;
    width: 100%;
    background: linear-gradient(to top, var(--a), var(--b));
  }
</style>
```

@sourceLink
[ColorPlus.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/ColorPlus.svelte)
-->

<GenericInputFolding
	bind:value
	bind:expanded
	bind:ref
	on:change
	{buttonClass}
	{options}
	plugin={pluginModule}
	{...$$restProps}
/>
{#if !BROWSER && expanded && $$props.picker === 'inline'}
	<!-- Main swatch -->
	<ClsPad keysAdd={fillWith('containerUnitSize', 6)} theme={$$props.theme} />
	<ClsPad keysAdd={fillWith('containerUnitSpacing', 3)} theme={$$props.theme} />
	<!-- Detect alpha slider... -->
	{#if ColorPlusModel.getFormat(value, false, type)?.alpha}
		<ClsPad keysAdd={fillWith('containerUnitSize', 1)} theme={$$props.theme} />
		<ClsPad extra={2} keysAdd={fillWith('containerVerticalPadding', 2)} theme={$$props.theme} />
	{/if}
{/if}
