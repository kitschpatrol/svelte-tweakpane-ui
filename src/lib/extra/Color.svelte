<script lang="ts" context="module">
	import type { Simplify } from '$lib/utils';

	import type {
		RgbColorObject,
		RgbaColorObject
	} from '@tweakpane/core/dist/input-binding/color/model/color.js';

	// TODO tuples, oklch, etc
	export type ColorValueRgbObject = Simplify<RgbColorObject>;
	export type ColorValueRgbaObject = Simplify<RgbaColorObject>;
	export type ColorValueString = string;
	export type ColorValue = Simplify<ColorValueRgbObject | ColorValueRgbaObject | ColorValueString>;
</script>

<script lang="ts">
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte';
	import type { ComponentProps } from 'svelte';
	import type { ColorInputParams as ColorOptions } from 'tweakpane';
	import { BROWSER } from 'esm-env';

	type $$Props = Omit<
		ComponentProps<GenericInputFolding<ColorValue, ColorOptions>>,
		'buttonClass' | 'options' | 'ref' | 'plugin'
	> & {
		/**
		 * A color value to control.
		 *
		 * Use either a color-like string (e.g. #ff00ff), or an object with `r`, `b`, `g`, and optional `a` keys.
		 * @bindable
		 * */
		value: ColorValue;
	};

	// must redeclare for bindability
	export let value: $$Props['value'];
	export let expanded: $$Props['expanded'] = undefined;

	// work-arounds for funky folding
	const buttonClass = 'tp-colswv_b';

	// TODO does this do anyhting?
	// passing channel like 0x00ffd644 adds alpha automatically
	// setting alpha to true on 0x00ffd6 doesn't add the control...
	// were these both deprecated in 4.0? https://github.com/cocopon/tweakpane/issues/450
	// options.color.alpha,
	// options.color.type

	const options: ColorOptions = {
		view: 'color'
	};
</script>

<!--
@component
A color picker.

Wraps Tweakpane's [color input binding](https://tweakpane.github.io/docs/input-bindings/#color).

Usage outside of a `<Pane>` component will implicitly wrap the color picker in `<Pane position='inline'>`.

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
  <Color label="Start Color" bind:value={startColor} />
  <Color label="End Color" bind:value={endColor} />
</div>
```

@sourceLink [Color.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/extra/Color.svelte)
-->

{#if BROWSER}
	<GenericInputFolding bind:expanded bind:value {options} {buttonClass} {...$$restProps} />
{/if}
