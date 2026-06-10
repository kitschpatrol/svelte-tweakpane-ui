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
		 * For number values only: Whether to treat the number as carrying an alpha
		 * component in its lowest byte (e.g. `0xff00667f`). (TODO not sure this is
		 * a good idea to expose...)
		 *
		 * @default `false`
		 */
		alpha?: boolean
		/**
		 * Keep the color inside the widest gamut configured in `gamuts`.
		 *
		 * Picks on the palette plane snap to the in-gamut frontier, while slider
		 * moves, typed text, and externally bound values shed chroma (at constant
		 * lightness and hue) to fit.
		 *
		 * Set to `false` to allow out-of-gamut colors.
		 *
		 * @default `true`
		 */
		constrain?: boolean
		/**
		 * Whether a valid color entered in the picker's text field is converted
		 * back to the bound value's original format.
		 *
		 * Set to `false` to let a typed value switch the binding's format to match
		 * what was typed. _(Experimental!)_
		 *
		 * @default `true`
		 */
		formatLocked?: boolean
		/**
		 * Draw the name of the narrowest configured gamut that holds the current
		 * color in the picker plane's bottom-left corner.
		 *
		 * The default adapts to the bound color's model: `true` when it's wide or
		 * perceptual, `false` when it's sRGB-bound.
		 *
		 * @default `true` (`false` for sRGB-bound color models)
		 */
		gamutLabel?: boolean
		/**
		 * Which configured gamut boundaries are stroked over the picker plane.
		 *
		 * `'inner'` draws the narrower gamuts' lines, `'outer'` draws the widest
		 * gamut's line (otherwise redundant with the drawn plane's own edge),
		 * `'all'` draws both, and `'none'` hides every line.
		 *
		 * @default `'inner'`
		 */
		gamutLines?: 'all' | 'inner' | 'none' | 'outer'
		/**
		 * RGB gamuts whose boundaries the OKLCH picker draws, as an array of ids.
		 *
		 * Both colorjs ids and their CSS aliases are accepted: `'srgb'`, `'p3'` /
		 * `'display-p3'`, `'a98rgb'` / `'a98-rgb'`, `'rec2020'`, and `'prophoto'` /
		 * `'prophoto-rgb'`.
		 *
		 * The default adapts to the bound color's model: `['srgb', 'p3']` when it's
		 * wide or perceptual, `['srgb']` when it's sRGB-bound.
		 *
		 * @default `['srgb', 'p3']` (`['srgb']` for sRGB-bound color models)
		 */
		gamuts?: string[]
		/**
		 * Which OKLCH channels map to the picker plane's axes and the slider, as
		 * `[X][Y]_[slider]`.
		 *
		 * @default `'CL_H'`
		 */
		paletteChannels?: 'CH_L' | 'CL_H' | 'HC_L' | 'HL_C' | 'LC_H' | 'LH_C'
		/**
		 * How the picker plane projects the gamut volume onto its rectangle.
		 *
		 * `'okhsv'` uses an OKHSV saturation / value projection on lightness ×
		 * chroma layouts (the most similar to Tweakpane's built-in palette),
		 * falling back to `'stretch'` behavior on other layouts. `'perceptual'`
		 * keeps absolute OKLCH spacing, so the gamut sits as an irregular region
		 * within the plane. `'stretch'` fills the plane with the widest gamut, row
		 * by row.
		 *
		 * @default `'okhsv'`
		 */
		paletteProjection?: 'okhsv' | 'perceptual' | 'stretch'
		/**
		 * How the swatch preview's fallback triangle forces an out-of-gamut color
		 * into sRGB.
		 *
		 * `'clip'` clamps each channel to its range, matching what the browser
		 * paints on screen. `'css'` applies the [CSS Color 4 gamut-mapping
		 * algorithm](https://www.w3.org/TR/css-color-4/#gamut-mapping) (chroma
		 * reduction at constant lightness and hue), which can disagree with
		 * on-screen rendering.
		 *
		 * Only affects the swatch preview, never the color value itself.
		 *
		 * @default `'clip'`
		 */
		swatchFallback?: 'clip' | 'css'
		/**
		 * Show the color model drop-down and per-channel text inputs below the
		 * picker palette.
		 *
		 * Set to `false` to hide them for a more compact, pointer-only picker. (The
		 * alpha slider's text input, if present, is unaffected.)
		 *
		 * @default `true`
		 */
		textFields?: boolean
		/**
		 * Whether to treat values as floats from 0.0 to 1.0, or integers from 0 to
		 * 255.
		 *
		 * @default `'int'`
		 */
		type?: 'float' | 'int'
		/**
		 * A color value to control.
		 *
		 * Use either a color-like string (e.g. #ff00ff), a number, an object with
		 * `r`, `b`, `g`, and optional `a` keys, or a tuple.
		 *
		 * @bindable
		 */
		value: ColorPlusValue
	}

	// Must redeclare for bindability
	export let value: $$Props['value']
	export let expanded: $$Props['expanded'] = undefined
	export let type: $$Props['type'] = undefined
	export let alpha: $$Props['alpha'] = undefined
	export let constrain: $$Props['constrain'] = undefined
	export let formatLocked: $$Props['formatLocked'] = undefined
	export let gamutLabel: $$Props['gamutLabel'] = undefined
	export let gamutLines: $$Props['gamutLines'] = undefined
	export let gamuts: $$Props['gamuts'] = undefined
	export let paletteChannels: $$Props['paletteChannels'] = undefined
	export let paletteProjection: $$Props['paletteProjection'] = undefined
	export let swatchFallback: $$Props['swatchFallback'] = undefined
	export let textFields: $$Props['textFields'] = undefined

	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to
		 * bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin`
		 * field to distinguish between user-interactive changes (`internal`) and
		 * changes resulting from programmatic manipulation of the `value`
		 * (`external`).
		 *
		 * @extends ValueChangeEvent
		 * @event
		 */
		change: ColorPlusChangeEvent
	}

	let options: ColorPlusOptions
	let ref: ColorPlusRef

	// Work-around for funky folding
	const buttonClass = 'tp-colswv_b'

	$: options = {
		color: {
			alpha,
			formatLocked,
			type,
		},
		constrain,
		gamutLabel,
		gamutLines,
		gamuts,
		paletteChannels,
		paletteProjection,
		swatchFallback,
		textFields,
		view: 'color-plus',
	}
</script>

<!--
@component  

A color picker with support for additional color value formats.

Integrates the color control from the [Color Plus
plugin](https://github.com/kitschpatrol/tweakpane-plugin-color-plus).

This component looks very similar to the Tweakpane-native `<Color>` control, but it adds support for all [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) color string formats, color arrays, a wider range of color objects, and a revised color picker with support for wide-gamut color spaces.

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
	<ClsPad
		keysAdd={fillWith('containerUnitSize', textFields === false ? 5 : 6)}
		theme={$$props.theme}
	/>
	<ClsPad
		keysAdd={fillWith('containerUnitSpacing', textFields === false ? 2 : 3)}
		theme={$$props.theme}
	/>
	<!-- Detect alpha slider... -->
	{#if alpha === true || ColorPlusModel.getFormat(value, alpha, type)?.alpha}
		<ClsPad keysAdd={fillWith('containerUnitSize', 1)} theme={$$props.theme} />
		<ClsPad extra={2} keysAdd={fillWith('containerVerticalPadding', 2)} theme={$$props.theme} />
	{/if}
{/if}
