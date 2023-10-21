<script lang="ts">
	import GenericInputFolding from '../internal/GenericInputFolding.svelte';
	import type { ComponentProps } from 'svelte';

	import type {
		RgbColorObject,
		RgbaColorObject
	} from '@tweakpane/core/dist/input-binding/color/model/color.js';

	type ColorValue = string | RgbColorObject | RgbaColorObject;

	interface $$Props
		extends Omit<
			ComponentProps<GenericInputFolding<ColorValue>>,
			'buttonClass' | 'bindingParams' | 'bindingRef' | 'plugin'
		> {
		/** A color value to control. Use either a color-like string (e.g. #ff00ff), or an object with `r`, `b`, `g`, and optional `a` keys. Bindable. */
		value: ColorValue;
	}

	// must redeclare for bindability
	export let value: $$Props['value'];
	export let expanded: $$Props['expanded'] = undefined;

	// work-arounds for funky folding
	const buttonClass = 'tp-colswv_b';

	// TODO does this do anyhting?
	// passing channel like 0x00ffd644 adds alpha automatically
	// setting alpha to true on 0x00ffd6 doesn't add the control...
	// were these both deprecated in 4.0? https://github.com/cocopon/tweakpane/issues/450
	// bindingParams.color.alpha,
	// bindingParams.color.type

	const bindingParams = {
		view: 'color'
	};
</script>

<!--
@component
A color picker.

Wraps Tweakpane's [color input binding](https://tweakpane.github.io/docs/input-bindings/#color).

Usage outside of a `<Pane>` component will implicitly wrap the color picker in `<Pane position="inline">`.

Example:	
```tsx
<script lang="ts">
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
	<ColorPicker label="Start Color" bind:value={startColor} />
	<ColorPicker label="End Color" bind:value={endColor} />
</div>
```
-->

<GenericInputFolding bind:expanded bind:value {bindingParams} {buttonClass} {...$$restProps} />
