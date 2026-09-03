<script context="module" lang="ts">
	import type {
		RgbaColorObject,
		RgbColorObject,
	} from '@tweakpane/core/dist/input-binding/color/model/color.js'
	import type { Simplify, ValueChangeEvent } from '$lib/utils.js'

	export type ColorValueRgbTuple = [r: number, g: number, b: number]
	export type ColorValueRgbaTuple = [r: number, g: number, b: number, a: number]
	export type ColorValueRgbObject = Simplify<RgbColorObject>
	export type ColorValueRgbaObject = Simplify<RgbaColorObject>
	export type ColorValueString = string
	export type ColorValueNumber = number
	export type ColorValue = Simplify<
		| ColorValueNumber
		| ColorValueRgbaObject
		| ColorValueRgbaTuple
		| ColorValueRgbObject
		| ColorValueRgbTuple
		| ColorValueString
	>

	export type ColorChangeEvent = ValueChangeEvent<ColorValue>
</script>

<script generics="T extends ColorValue" lang="ts">
	import type { ComponentProps } from 'svelte'
	import type { ColorInputParams as ColorOptions, InputBindingApi as ColorRef } from 'tweakpane'
	import { isColorObject, isRgbaColorObject, isRgbColorObject } from '@tweakpane/core'
	import { BROWSER } from 'esm-env'
	import { shallowEqual } from 'fast-equals'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte'
	import { fillWith, objectToTuple, removeKeys } from '$lib/utils.js'

	type ColorValueInternal =
		ColorValueNumber | ColorValueRgbaObject | ColorValueRgbObject | ColorValueString

	type ColorValueObjectOrTuple =
		ColorValueRgbaObject | ColorValueRgbaTuple | ColorValueRgbObject | ColorValueRgbTuple

	type PropsForType<U> = (U extends ColorValueNumber
		? {
				/**
				 * Whether to treat a `number` value as carrying an alpha component in
				 * its lowest byte (e.g. `0xff00667f`).
				 *
				 * @default `false`
				 */
				alpha?: boolean
			}
		: unknown) &
		(U extends ColorValueObjectOrTuple
			? {
					/**
					 * Whether to treat `object` or `tuple` values as floats from 0.0 to
					 * 1.0, or integers from 0 to 255.
					 *
					 * @default `'int'`
					 */
					type?: 'float' | 'int'
				}
			: unknown)

	type $$Props = Omit<
		ComponentProps<GenericInputFolding<T, ColorOptions>>,
		'buttonClass' | 'options' | 'plugin' | 'ref'
	> &
		PropsForType<T> & {
			/**
			 * A color value to control.
			 *
			 * Use either a color-like string (e.g. #ff00ff), a number (e.g.
			 * 0xff00ff), an object with `r`, `b`, `g`, and optional `a` keys, or a
			 * tuple.
			 *
			 * The type of this value will determine the availability of the `alpha`
			 * and `type` props.
			 *
			 * @bindable
			 */
			value: T
		}

	// Must redeclare for bindability
	// Concrete types instead of $$Props indexes to work around deferred
	// conditional type resolution, see similar in Point.svelte
	export let value: T
	export let expanded: boolean | undefined = undefined

	// Dynamic non-bindable props, availability gated on the type of `value`
	let alpha: boolean | undefined
	$: alpha = ($$props['alpha'] as boolean | undefined) ?? undefined
	let type: 'float' | 'int' | undefined
	$: type = ($$props['type'] as 'float' | 'int' | undefined) ?? undefined

	// Inheriting here with ComponentEvents makes a documentation mess

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
		change: ColorChangeEvent
	}

	let internalValue: ColorValueInternal
	let options: ColorOptions
	let ref: ColorRef

	// Work-around for funky folding
	const buttonClass = 'tp-colswv_b'

	function updateInternalValueFromValue() {
		// External value can change internal type on the fly, but internal value can never change external value type!
		// Internal value must be a string, number, or object for Tweakpane compatibility
		if (typeof value === 'string' || typeof value === 'number') {
			if (internalValue !== value) {
				internalValue = value
			}
		} else if (isColorObject(value)) {
			if (!shallowEqual(value, internalValue)) {
				internalValue = { ...value } satisfies ColorValueRgbaObject | ColorValueRgbObject
			}
		} else if (Array.isArray(value)) {
			const newInternalValue: ColorValueRgbaObject | ColorValueRgbObject | undefined =
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
		if (
			(typeof value === 'string' && typeof internalValue === 'string') ||
			(typeof value === 'number' && typeof internalValue === 'number')
		) {
			if (internalValue !== value) {
				// eslint-disable-next-line ts/no-unnecessary-type-assertion
				value = internalValue as T
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
				// eslint-disable-next-line ts/no-unnecessary-type-assertion
				value = newValue as T
			}
		} else if (isColorObject(value) && isColorObject(internalValue)) {
			if (!shallowEqual(internalValue, value)) {
				// eslint-disable-next-line ts/no-unnecessary-type-assertion
				value = { ...internalValue } as T
			}
		} else {
			console.error('Unreachable color type mismatch')
		}
	}

	$: (value, updateInternalValueFromValue())
	$: (internalValue, updateValueFromInternalValue())
	$: options = {
		color: {
			alpha,
			type,
		},
		view: 'color',
	}
</script>

<!--
@component
A color picker.

Wraps Tweakpane's [color input binding](https://tweakpane.github.io/docs/input-bindings/#color).

`<Color>` is a dynamic component: the `alpha` prop is only available when `value` is a number, and
the `type` prop is only available when `value` is an object or tuple. (Other value types carry
their own alpha and type information.)

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
	{buttonClass}
	{options}
	bind:value={internalValue}
	bind:expanded
	bind:ref
	on:change
	{...removeKeys($$restProps, 'alpha', 'type')}
/>
{#if !BROWSER && expanded && $$props.picker === 'inline'}
	<!-- Main swatch -->
	<ClsPad keysAdd={fillWith('containerUnitSize', 6)} theme={$$props.theme} />
	<ClsPad keysAdd={fillWith('containerUnitSpacing', 3)} theme={$$props.theme} />
	{#if alpha === true || isRgbaColorObject(internalValue)}
		<ClsPad keysAdd={fillWith('containerUnitSize', 1)} theme={$$props.theme} />
		<ClsPad extra={2} keysAdd={fillWith('containerVerticalPadding', 2)} theme={$$props.theme} />
	{/if}
{/if}
