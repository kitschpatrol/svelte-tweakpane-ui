<script lang="ts">
	import type { RingUnit } from '@tweakpane/plugin-camerakit/dist/types/view/ring.d.ts';
	import type { RingSeries } from '@tweakpane/plugin-camerakit/dist/types/util.js';
	import GenericInput from '$lib/internal/GenericInput.svelte';

	// Would be better, but is broken
	// Plus omit breaks autocomplete
	// https://github.com/sveltejs/svelte/issues/8476
	// interface $$Props
	// 	extends Omit<
	// 		ComponentProps<GenericInput<number, BindingApi>>,
	// 		'bindingParams' | 'bindingRef'
	// > {}

	// re-exported
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let value: number;

	// unique
	export let series: RingSeries | undefined = undefined;
	export let unit: RingUnit | undefined = undefined;
	export let wide: boolean | undefined = undefined;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let step: number | undefined = undefined;
	export let pointerScale: number | undefined = undefined;
	export let keyScale: number | undefined = undefined;
	export let format: ((value: number) => string) | undefined = undefined;

	let bindingParams = {
		view: 'cameraring',
		series,
		unit,
		wide,
		min,
		max,
		step,
		pointerScale,
		keyScale,
		format
	};
</script>

<GenericInput bind:value {disabled} {label} {bindingParams} />
