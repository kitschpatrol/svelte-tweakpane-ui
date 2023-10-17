<script lang="ts">
	import GenericInputFolding from '../internal/GenericInputFolding.svelte';
	import type { Theme } from '../theme.js';
	import type { EulerOrder } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerOrder.js';
	import type { EulerUnit } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerUnit.js';
	import type { PickerLayout, PointDimensionParams } from '@tweakpane/core';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;
	export let value: { x: number; y: number; z: number };
	export let clickToExpand: boolean = true;
	export let expanded: boolean | undefined = undefined;
	export let picker: PickerLayout | undefined = undefined;

	// unique
	export let order: EulerOrder | undefined = undefined;
	export let unit: EulerUnit | undefined = undefined;
	export let x: PointDimensionParams | undefined = undefined;
	export let y: PointDimensionParams | undefined = undefined;
	export let z: PointDimensionParams | undefined = undefined;

	// work-arounds for funky folding
	const buttonClass = 'tp-rotationswatchv_b';

	$: bindingParams = {
		view: 'rotation',
		rotationMode: 'euler',
		order,
		unit,
		x,
		y,
		z
	};
</script>

<GenericInputFolding
	bind:expanded
	{buttonClass}
	{picker}
	{clickToExpand}
	{label}
	{disabled}
	{bindingParams}
	bind:value
	{theme}
/>
