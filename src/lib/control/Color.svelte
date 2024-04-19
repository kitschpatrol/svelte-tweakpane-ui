<script context="module" lang="ts">
	import type {
		RgbColorObject,
		RgbaColorObject
	} from '@tweakpane/core/dist/input-binding/color/model/color.js';
	import type { Simplify } from '$lib/utils';
	import type { ValueChangeEvent } from '$lib/utils.js';

	// TODO tuples, oklch, etc TODO set default picker mode between rgb, hsl, etc.?
	export type ColorValueRgbTuple = [r: number, g: number, b: number];
	export type ColorValueRgbaTuple = [r: number, g: number, b: number, a: number];
	export type ColorValueRgbObject = Simplify<RgbColorObject>;
	export type ColorValueRgbaObject = Simplify<RgbaColorObject>;
	export type ColorValueString = string;
	export type ColorValue = Simplify<
		| ColorValueRgbObject
		| ColorValueRgbTuple
		| ColorValueRgbaObject
		| ColorValueRgbaTuple
		| ColorValueString
	>;

	export type ColorChangeEvent = ValueChangeEvent<ColorValue>;
</script>

<script lang="ts">
	import { isColorObject, isObject, isRgbColorObject, isRgbaColorObject } from '@tweakpane/core';
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte';
	import { objectToTuple, tupleToObject } from '$lib/utils';
	import { fillWith } from '$lib/utils';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';
	import type { ColorInputParams as ColorOptions, InputBindingApi as ColorRef } from 'tweakpane';

	type ColorValueInternal = ColorValueRgbObject | ColorValueRgbaObject | ColorValueString;

	type $$Props = {
		/**
		 * A color value to control.
		 *
		 * Use either a color-like string (e.g. #ff00ff), or an object with `r`, `b`, `g`, and
		 * optional `a` keys.
		 * @bindable
		 * */
		value: ColorValue;
		/**
		 * Whether to treat values as floats from 0.0 to 1.0, or integers from 0 to 255.
		 * @default `'int'`
		 * */
		type?: 'float' | 'int';
	} & Omit<
		ComponentProps<GenericInputFolding<ColorValue, ColorOptions>>,
		'buttonClass' | 'options' | 'plugin' | 'ref'
	>;

	// Must redeclare for bindability
	export let value: $$Props['value'];
	export let expanded: $$Props['expanded'] = undefined;
	export let type: $$Props['type'] = undefined;

	// Inheriting here with ComponentEvents makes a documentation mess
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 *
		 * @extends ValueChangeEvent
		 * @event
		 * */
		change: ColorChangeEvent;
	};

	let internalValue: ColorValueInternal;
	let options: ColorOptions;
	let ref: ColorRef;

	// Work-around for funky folding
	const buttonClass = 'tp-colswv_b';

	function updateInternalValue() {
		if (Array.isArray(value)) {
			if (value.length === 4) {
				internalValue = tupleToObject(value, ['r', 'g', 'b', 'a']);
			} else if (value.length === 3) {
				internalValue = tupleToObject(value, ['r', 'g', 'b']);
			} else {
				console.error('Unreachable');
			}
		} else {
			// String or object
			internalValue = value;
		}
	}

	function updateValue() {
		if (Array.isArray(value) && isColorObject(internalValue)) {
			if (isRgbaColorObject(internalValue)) {
				value = objectToTuple(internalValue, ['r', 'g', 'b', 'a']);
			} else if (isRgbColorObject(internalValue)) {
				value = objectToTuple(internalValue, ['r', 'g', 'b']);
			} else {
				console.error('Unreachable');
			}
		} else if (typeof value === 'string') {
			value = internalValue;
		} else if (isObject(value)) {
			value = internalValue;
		} else {
			console.error('Unreachable');
		}
	}

	// TODO does this do anything? passing channel like 0x00ffd644 adds alpha automatically setting
	// alpha to true on 0x00ffd6 doesn't add the control... were these both deprecated in 4.0?
	// https://github.com/cocopon/tweakpane/issues/450 options.color.alpha, options.color.type

	function addListeners() {
		ref.on('change', () => {
			// Issue where changes from the color picker swatch view aren't reflected in other
			// controls on the same pane TODO figure this out...
			ref.refresh();
		});
	}

	$: value, updateInternalValue();
	$: internalValue, updateValue();
	$: ref !== undefined && addListeners();
	$: options = {
		color: {
			type
		},
		view: 'color'
	};
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
  import { Color } from 'svelte-tweakpane-ui';

  let startColor = '#fff000';
  let endColor = '#ff00ff';
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
