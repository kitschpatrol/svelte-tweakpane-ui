<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { EulerOrder } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerOrder.js';
	import type { EulerUnit } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerUnit.js';
	import type { PointDimensionParams, PickerLayout } from '@tweakpane/core';
	import type { Theme } from '$lib/theme.js';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;
	export let value: { x: number; y: number; z: number };

	// unique
	export let expanded: boolean | undefined = undefined;
	export let picker: PickerLayout | undefined = undefined;
	export let order: EulerOrder | undefined = undefined;
	export let unit: EulerUnit | undefined = undefined;
	export let x: PointDimensionParams | undefined = undefined;
	export let y: PointDimensionParams | undefined = undefined;
	export let z: PointDimensionParams | undefined = undefined;

	$: bindingParams = {
		view: 'rotation',
		rotationMode: 'euler',
		expanded,
		picker,
		order,
		unit,
		x,
		y,
		z
	};
</script>

<GenericInput {label} {disabled} {bindingParams} bind:value {theme} />
