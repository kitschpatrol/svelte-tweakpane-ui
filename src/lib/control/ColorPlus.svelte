<script context="module" lang="ts">
	import type {
		ColorPlusInputParams as ColorPlusOptions,
		ColorPlusValue,
	} from 'tweakpane-plugin-color-plus/lite'
	import type { ValueChangeEvent } from '$lib/utils.js'

	type ColorPlusColorOptions = NonNullable<ColorPlusOptions['color']>

	export type { ColorPlusValue } from 'tweakpane-plugin-color-plus/lite'
	export type ColorPlusChangeEvent = ValueChangeEvent<ColorPlusValue>
	export type ColorPlusGamutLines = NonNullable<ColorPlusOptions['gamutLines']>
	export type ColorPlusPaletteChannels = NonNullable<ColorPlusOptions['paletteChannels']>
	export type ColorPlusPaletteProjection = NonNullable<ColorPlusOptions['paletteProjection']>
	export type ColorPlusSwatchFallback = NonNullable<ColorPlusOptions['swatchFallback']>
	export type ColorPlusType = NonNullable<ColorPlusColorOptions['type']>
	export type ColorPlusValueNumber = Extract<ColorPlusValue, number>
	export type ColorPlusValueObject = Exclude<
		ColorPlusValue,
		ColorPlusValueNumber | ColorPlusValueString | ColorPlusValueTuple
	>
	export type ColorPlusValueString = Extract<ColorPlusValue, string>
	export type ColorPlusValueTuple = Extract<ColorPlusValue, unknown[]>
</script>

<script generics="T extends ColorPlusValue" lang="ts">
	import type { ComponentProps } from 'svelte'
	import type { InputBindingApi as ColorPlusRef } from 'tweakpane'
	import { BROWSER } from 'esm-env'
	import * as pluginModule from 'tweakpane-plugin-color-plus/lite'
	import { ColorPlusModel } from 'tweakpane-plugin-color-plus/lite'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte'
	import { fillWith, removeKeys } from '$lib/utils.js'

	type PropsForType<U> = (U extends ColorPlusValueObject | ColorPlusValueTuple
		? {
				/**
				 * Whether coordinate channels are floats from 0.0 to 1.0 or integers
				 * from 0 to 255. Alpha channels always use the 0.0 to 1.0 range.
				 *
				 * @default `'int'`
				 */
				type?: ColorPlusType
			}
		: unknown) &
		(U extends number
			? {
					/**
					 * Treat the number as carrying an alpha component in its lowest byte
					 * (e.g. `0xff00667f`).
					 *
					 * @default `false`
					 */
					alpha?: ColorPlusColorOptions['alpha']
				}
			: unknown)

	type CommonProps<U extends ColorPlusValue> = Omit<
		ComponentProps<GenericInputFolding<U, ColorPlusOptions>>,
		'buttonClass' | 'options' | 'plugin' | 'ref'
	> & {
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
		constrain?: ColorPlusOptions['constrain']
		/**
		 * Whether a valid color entered in the picker's text field is converted
		 * back to the bound value's original format.
		 *
		 * Set to `false` to let a typed value switch the binding's format to match
		 * what was typed, provided the new format has the same value type and
		 * shape. _(Experimental!)_
		 *
		 * @default `true`
		 */
		formatLocked?: ColorPlusColorOptions['formatLocked']
		/**
		 * Draw the name of the narrowest configured gamut that holds the current
		 * color in the picker plane's bottom-left corner.
		 *
		 * The default adapts to the initially bound color's model.
		 *
		 * @default `false` for sRGB-bound models; `true` for wide / perceptual models
		 */
		gamutLabel?: ColorPlusOptions['gamutLabel']
		/**
		 * Which configured gamut boundaries are stroked over the picker plane.
		 *
		 * `'inner'` draws the narrower gamuts' lines, `'outer'` draws the widest
		 * gamut's line (otherwise redundant with the drawn plane's own edge),
		 * `'all'` draws both, and `'none'` hides every line.
		 *
		 * @default `'inner'`
		 */
		gamutLines?: ColorPlusGamutLines
		/**
		 * RGB gamuts whose boundaries the OKLCH picker draws, as an array of ids.
		 *
		 * Both colorjs ids and their CSS aliases are accepted: `'srgb'`, `'p3'` /
		 * `'display-p3'`, `'a98rgb'` / `'a98-rgb'`, `'rec2020'`, and `'prophoto'` /
		 * `'prophoto-rgb'`.
		 *
		 * The default adapts to the initially bound color's model.
		 *
		 * @default `['srgb']` for sRGB-bound models; `['srgb', 'p3']` for wide / perceptual models
		 */
		gamuts?: ColorPlusOptions['gamuts']
		/**
		 * Which OKLCH channels map to the picker plane's axes and the slider, as
		 * `[X][Y]_[slider]`.
		 *
		 * @default `'CL_H'`
		 */
		paletteChannels?: ColorPlusPaletteChannels
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
		paletteProjection?: ColorPlusPaletteProjection
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
		swatchFallback?: ColorPlusSwatchFallback
		/**
		 * Show the color model drop-down and per-channel text inputs below the
		 * picker palette.
		 *
		 * Set to `false` to hide them for a more compact, pointer-only picker. (The
		 * alpha slider's text input, if present, is unaffected.)
		 *
		 * @default `true`
		 */
		textFields?: ColorPlusOptions['textFields']
		/**
		 * A color value to control.
		 *
		 * Use a CSS color or named-color string, a packed number, a three- or
		 * four-item RGB(A) tuple, or a supported RGB, HSL, HSV / HSB, HWB, Lab, or
		 * LCH object shape.
		 *
		 * The value's type determines whether the `alpha` or `type` prop is
		 * available.
		 *
		 * @bindable
		 */
		value: U
	}

	type $$Props = CommonProps<T> & PropsForType<T>

	// Must redeclare for bindability
	export let value: T
	export let expanded: boolean | undefined = undefined
	export let constrain: ColorPlusOptions['constrain'] = undefined
	export let formatLocked: ColorPlusColorOptions['formatLocked'] = undefined
	export let gamutLabel: ColorPlusOptions['gamutLabel'] = undefined
	export let gamutLines: ColorPlusGamutLines | undefined = undefined
	export let gamuts: ColorPlusOptions['gamuts'] = undefined
	export let paletteChannels: ColorPlusPaletteChannels | undefined = undefined
	export let paletteProjection: ColorPlusPaletteProjection | undefined = undefined
	export let swatchFallback: ColorPlusSwatchFallback | undefined = undefined
	export let textFields: ColorPlusOptions['textFields'] = undefined

	let alpha: ColorPlusColorOptions['alpha']
	let type: ColorPlusType | undefined

	$: alpha = $$props['alpha'] ?? undefined
	$: type = $$props['type'] ?? undefined

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

_Important: This component is still under development and should be considered experimental. The API is subject to change until the Svelte Tweakpane UI 2.0 release._

Integrates the color control from the [Color Plus
plugin](https://github.com/kitschpatrol/tweakpane-plugin-color-plus).

This component looks very similar to the Tweakpane-native `<Color>` control, but it adds support for all [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/) color formats, [named-color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/named-color) strings, packed numbers, RGB(A) tuples, a wider range of color objects, and a revised color picker with wide-gamut support.

Its API is a superset of Tweakpane's built-in color input, so `<ColorPlus>` can generally be used as a drop-in replacement for `<Color>`. Please report any issues you encounter.

`<ColorPlus>` is a dynamic component. The `alpha` prop is available for number values, while the `type` prop is available for object and tuple / array values. Other props are shared by every supported value type.

The `gamuts` and `gamutLabel` defaults adapt to the initially bound color's model: sRGB-bound models get a simple sRGB picker, while wide and perceptual models get Display P3 boundaries and a gamut label. The text fields also open in a mode appropriate to that model.

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
	{buttonClass}
	{options}
	plugin={pluginModule}
	bind:value
	bind:expanded
	bind:ref
	on:change
	{...removeKeys($$restProps, 'alpha', 'type')}
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
