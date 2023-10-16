<script lang="ts">
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte';
	import type { Theme } from '$lib/theme.js';
	import type { PickerLayout } from '@tweakpane/core';
	import type { ColorInputParams } from 'tweakpane';

	import type {
		RgbColorObject,
		RgbaColorObject
	} from '@tweakpane/core/dist/input-binding/color/model/color.js';

	// re-exported

	/** Text displayed next to control. Defaults to `undefined.` */
	export let label: string | undefined = undefined;

	/** Prevent interactivity. Defaults to `false`. */
	export let disabled: boolean = false;

	/** Custom color scheme. Only applies if the `<ColorPicker>` is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;

	/** Expand or collapse the color picker. Defaults to `true`. Bindable. */
	export let expanded: boolean | undefined = undefined;

	/** Allow users to interactively expand / contract the picker. Regardless of `clickToExpand`, programmatic control remains available through the `expanded` prop. Defaults to `true`. */
	export let clickToExpand: boolean = true;

	/** Specify an `inline` or `popup` color picker control presentation. Defaults to `popup`. */
	export let picker: PickerLayout | undefined = undefined;

	// unique

	/** A color value to control. Use either a color-like string, or an object with `r`, `b`, `g`, and optional `a` keys. Bindable. */
	export let value: string | RgbColorObject | RgbaColorObject | undefined;

	// work-arounds for funky folding
	const buttonClass = 'tp-colswv_b';

	// TODO does this do anyhting?
	// passing channel like 0x00ffd644 adds alpha automatically
	// setting alpha to true on 0x00ffd6 doesn't add the control...
	// were these both deprecated in 4.0? https://github.com/cocopon/tweakpane/issues/450
	// bindingParams.color.alpha,
	// bindingParams.color.type

	$: bindingParams = {
		view: 'color'
	} satisfies ColorInputParams;
</script>

<!--
@component
A color picker.

Wraps Tweakpane's [color input binding](https://tweakpane.github.io/docs/input-bindings/#color).

Usage outside of a `<Pane>` component will implicitly wrap the color picker in a `<InternalPaneInline>`.

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

<GenericInputFolding
	{buttonClass}
	bind:expanded
	bind:value
	{label}
	{picker}
	{disabled}
	{bindingParams}
	{clickToExpand}
	{theme}
/>
