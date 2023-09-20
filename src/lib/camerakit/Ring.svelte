<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import type { BindingApi, BaseInputParams } from '@tweakpane/core';
	import type { RingUnit } from '@tweakpane/plugin-camerakit/dist/types/view/ring.d.ts';
	import type { RingInputParams, RingSeries } from '@tweakpane/plugin-camerakit/dist/types/util.js';
	import GenericBinding from '$lib/internal/GenericBinding.svelte';

	interface $$Props
		extends Omit<
			ComponentProps<GenericBinding<number, BindingApi>>,
			'bindingParams' | 'bindingRef'
		> {}

	//https://github.com/sveltejs/svelte/issues/8476
	type test = ComponentProps<$$Self>;

	export let value: number;
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

	console.log($$props);
</script>

{JSON.stringify($$props)}
{JSON.stringify($$restProps)}
<GenericBinding bind:value {bindingParams} {...$$restProps} />
