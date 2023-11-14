<script context="module" lang="ts">
	import type {
		RgbColorObject,
		RgbaColorObject
	} from '@tweakpane/core/dist/input-binding/color/model/color.js';
	import type { Simplify } from '$lib/utils';

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
</script>

<script lang="ts">
	import { isColorObject, isObject, isRgbColorObject, isRgbaColorObject } from '@tweakpane/core';
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte';
	import { objectToTuple, tupleToObject } from '$lib/utils';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';
	import type { ColorInputParams as ColorOptions, InputBindingApi as ColorRef } from 'tweakpane';

	type ColorValueInternal = ColorValueRgbObject | ColorValueRgbaObject | ColorValueString;

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
		 * */
		value: ColorValue;
		/**
		 * Whether to treat values as floats from 0.0 to 1.0, or integers from 0 to 255.
		 * @default `'int'`
		 * */
		type?: 'float' | 'int';
	};

	// must redeclare for bindability
	export let value: $$Props['value'];
	export let expanded: $$Props['expanded'] = undefined;
	export let type: $$Props['type'] = undefined;

	let internalValue: ColorValueInternal;
	let options: ColorOptions;
	let ref: ColorRef;

	// work-around for funky folding
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
			// string or object
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

	$: value, BROWSER && updateInternalValue();
	$: internalValue, BROWSER && updateValue();
	$: BROWSER && ref !== undefined && addListeners();
	$: BROWSER &&
		(options = {
			color: {
				type
			},
			view: 'color'
		});
</script>

<!--
@component  
A color picker.

Wraps Tweakpane's [color input binding](https://tweakpane.github.io/docs/input-bindings/#color).

Usage outside of a `<Pane>` component will implicitly wrap the color picker in `<Pane
position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { Color } from 'svelte-tweakpane-ui';

  let startColor = '#fff000';
  let endColor = {
    r: 255,
    g: 0,
    b: 255
  };
</script>

<div
  style={`width: 300px; height: 300px; background: linear-gradient(${startColor}, rgb(${endColor.r}, ${endColor.g}, ${endColor.b}));`}
>
  <Color bind:value={startColor} label="Start Color" />
  <Color bind:value={endColor} label="End Color" />
</div>
```

@sourceLink
[Color.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/extra/Color.svelte)
-->

{#if BROWSER}
	<GenericInputFolding
		bind:value={internalValue}
		bind:expanded
		bind:ref
		{buttonClass}
		{options}
		{...$$restProps}
	/>
{/if}
