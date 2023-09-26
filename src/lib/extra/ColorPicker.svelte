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
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;
	export let expanded: boolean | undefined = undefined;

	// unique
	export let value: string | RgbColorObject | RgbaColorObject | undefined;
	export let picker: PickerLayout | undefined = undefined;

	// work-arounds for funky folding
	const buttonClass = 'tp-colswv_b';

	// TODO does this do anyhting?
	// passing channel like 0x00ffd644 adds alpha automatically
	// setting alpha to true on 0x00ffd6 doesn't add the control...
	// were these both deprecated in 4.0? https://github.com/cocopon/tweakpane/issues/450
	// bindingParams.color.alpha,
	// bindingParams.color.type

	$: bindingParams = {
		view: 'color',
		picker
	} satisfies ColorInputParams;
</script>

<GenericInputFolding
	{buttonClass}
	bind:expanded
	bind:value
	{label}
	{disabled}
	{bindingParams}
	{theme}
/>
