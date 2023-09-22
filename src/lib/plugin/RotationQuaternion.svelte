<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { PointDimensionParams, PickerLayout } from '@tweakpane/core';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let value: { x: number; y: number; z: number };

	// unique
	export let expanded: boolean | undefined = undefined;
	export let picker: PickerLayout | undefined = undefined;
	export let x: PointDimensionParams | undefined = undefined;
	export let y: PointDimensionParams | undefined = undefined;
	export let z: PointDimensionParams | undefined = undefined;
	export let w: PointDimensionParams | undefined = undefined;

	$: bindingParams = {
		view: 'rotation',
		rotationMode: 'quaternion',
		expanded,
		picker,
		x,
		y,
		z,
		w
	};
</script>

<GenericInput {label} {disabled} {bindingParams} bind:value />
