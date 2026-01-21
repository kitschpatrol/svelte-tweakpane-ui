<script context="module" lang="ts">
	import type {
		RgbaColorObject,
		RgbColorObject,
	} from '@tweakpane/core/dist/input-binding/color/model/color.js'
	import type { Simplify, ValueChangeEvent } from '$lib/utils.js'

	// TODO tuples, oklch, etc TODO set default picker mode between rgb, hsl, etc.?
	export type ColorValueRgbTuple = [r: number, g: number, b: number]
	export type ColorValueRgbaTuple = [r: number, g: number, b: number, a: number]
	export type ColorValueRgbObject = Simplify<RgbColorObject>
	export type ColorValueRgbaObject = Simplify<RgbaColorObject>
	export type ColorValueString = string
	export type ColorValue = Simplify<
		| ColorValueRgbaObject
		| ColorValueRgbaTuple
		| ColorValueRgbObject
		| ColorValueRgbTuple
		| ColorValueString
	>

	export type ColorChangeEvent = ValueChangeEvent<ColorValue>
</script>

<script lang="ts">
	import type { ComponentProps } from 'svelte'
	import type { ColorInputParams as ColorOptions, InputBindingApi as ColorRef } from 'tweakpane'
	import { isColorObject, isRgbaColorObject, isRgbColorObject } from '@tweakpane/core'
	import { BROWSER } from 'esm-env'
	import { shallowEqual } from 'fast-equals'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte'
	import { fillWith, objectToTuple } from '$lib/utils.js'

	type ColorValueInternal = ColorValueRgbaObject | ColorValueRgbObject | ColorValueString

	type $$Props = Omit<
		ComponentProps<GenericInputFolding<ColorValue, ColorOptions>>,
		'buttonClass' | 'options' | 'plugin' | 'ref'
	> & {
		/**
		 * A color value to control.
		 *
		 * Use either a color-like string (e.g. #ff00ff), or an object with `r`, `b`, `g`, and
		 * optional `a` keys.
		 * @bindable
		 */
		value: ColorValue
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

	// Inheriting here with ComponentEvents makes a documentation mess

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
		change: ColorChangeEvent
	}

	let internalValue: ColorValueInternal
	let options: ColorOptions
	let ref: ColorRef

	// Work-around for funky folding
	const buttonClass = 'tp-colswv_b'

	function updateInternalValueFromValue() {
		// External value can change internal type on the fly, but internal value can never change external value type!
		// Internal value must be string or object for Tweakpane compatibility
		if (typeof value === 'string') {
			if (internalValue !== value) {
				internalValue = value
			}
		} else if (isColorObject(value)) {
			if (!shallowEqual(value, internalValue)) {
				internalValue = { ...value } satisfies ColorValueRgbaObject | ColorValueRgbObject
			}
		} else if (Array.isArray(value)) {
			let newInternalValue: ColorValueRgbaObject | ColorValueRgbObject | undefined =
				value.length === 4
					? { r: value[0], g: value[1], b: value[2], a: value[3] }
					: value.length === 3
						? { r: value[0], g: value[1], b: value[2] }
						: undefined
			if (newInternalValue === undefined) {
				console.error('Unreachable')
			} else if (!shallowEqual(newInternalValue, internalValue)) {
				internalValue = newInternalValue
			}
		} else {
			console.error('Unreachable')
		}
	}

	function updateValueFromInternalValue() {
		if (typeof value === 'string' && typeof internalValue === 'string') {
			if (internalValue !== value) {
				value = internalValue
			}
		} else if (Array.isArray(value) && isColorObject(internalValue)) {
			const newValue = isRgbaColorObject(internalValue)
				? objectToTuple(internalValue, ['r', 'g', 'b', 'a'])
				: isRgbColorObject(internalValue)
					? objectToTuple(internalValue, ['r', 'g', 'b'])
					: undefined

			if (newValue === undefined) {
				console.error('Unreachable color type mismatch')
			} else if (!shallowEqual(newValue, value)) {
				value = newValue
			}
		} else if (isColorObject(value) && isColorObject(internalValue)) {
			if (!shallowEqual(internalValue, value)) {
				value = { ...internalValue }
			}
		} else {
			console.error('Unreachable color type mismatch')
		}
	}

	// TODO does this do anything? passing channel like 0x00ffd644 adds alpha automatically setting
	// alpha to true on 0x00ffd6 doesn't add the control... were these both deprecated in 4.0?
	// https://github.com/cocopon/tweakpane/issues/450 options.color.alpha, options.color.type

	$: (value, updateInternalValueFromValue())
	$: (internalValue, updateValueFromInternalValue())
	$: options = {
		color: {
			type,
		},
		view: 'color',
	}
</script>

<!--
@component  
A color picker.

Wraps Tweakpane's [color input binding](https://tweakpane.github.io/docs/input-bindings/#color).

Usage outside of a `<Pane>` component will implicitly wrap the color picker in `<Pane
position="inline">`.

@emits {ColorChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import { Color } from 'svelte-tweakpane-ui'

  let startColor = '#fff000'
  let endColor = '#ff00ff'
</script>

<Color bind:value={startColor} label="Start Color" />
<Color bind:value={endColor} label="End Color" />

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
[Color.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Color.svelte)
-->

<GenericInputFolding
	bind:value={internalValue}
	bind:expanded
	bind:ref
	on:change
	{buttonClass}
	{options}
	{...$$restProps}
/>
{#if !BROWSER && expanded && $$props.picker === 'inline'}
	<!-- Main swatch -->
	<ClsPad keysAdd={fillWith('containerUnitSize', 6)} theme={$$props.theme} />
	<ClsPad keysAdd={fillWith('containerUnitSpacing', 3)} theme={$$props.theme} />
	{#if isRgbaColorObject(internalValue)}
		<ClsPad keysAdd={fillWith('containerUnitSize', 1)} theme={$$props.theme} />
		<ClsPad extra={2} keysAdd={fillWith('containerVerticalPadding', 2)} theme={$$props.theme} />
	{/if}
{/if}
