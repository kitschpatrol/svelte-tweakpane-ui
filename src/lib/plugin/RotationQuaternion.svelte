<script lang="ts">
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte';
	import type { Theme } from '$lib/theme.js';
	import type { PickerLayout, PointDimensionParams } from '@tweakpane/core';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;
	export let value: { x: number; y: number; z: number };
	export let expanded: boolean | undefined = undefined;

	// unique
	export let picker: PickerLayout | undefined = undefined;
	export let x: PointDimensionParams | undefined = undefined;
	export let y: PointDimensionParams | undefined = undefined;
	export let z: PointDimensionParams | undefined = undefined;
	export let w: PointDimensionParams | undefined = undefined;

	// work-arounds for funky folding
	const buttonClass = 'tp-rotationswatchv_b';

	$: bindingParams = {
		view: 'rotation',
		rotationMode: 'quaternion',
		picker,
		x,
		y,
		z,
		w
	};
</script>

<GenericInputFolding
	bind:expanded
	{buttonClass}
	{label}
	{disabled}
	{bindingParams}
	bind:value
	{theme}
/>
