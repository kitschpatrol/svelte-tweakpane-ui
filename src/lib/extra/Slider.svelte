<script lang="ts" generics="U extends number | IntervalObject">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { NumberInputParams } from 'tweakpane';
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';

	// type InputParams<T> = T extends IntervalObject
	// 	? IntervalInputParams
	// 	: T extends number
	// 	? NumberInputParams
	// 	: unknown;

	// Note that we go from a regular slider to a rang / interval slider
	// (via the essentials plugin) just by changing the input type
	export let value: U;
	export let label: string = 'Slider';
	export let disabled: boolean = false;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let step: number | undefined = undefined;
	export let pointerScale: number | undefined = undefined;
	export let keyScale: number | undefined = undefined;
	export let format: ((value: number) => string) | undefined = undefined;

	// the IntervalInputParams type is identical
	// to NumberInputParams
	// so don't bother with generics
	let bindingParams: NumberInputParams;

	function getValue() {
		return value;
	}

	function setValue() {
		params[key] = value;
	}

	$: key = makeSafeKey(label);
	$: params = { [key]: getValue() };
	$: value = params[key];
	$: value, setValue();
	$: bindingParams = {
		min,
		max,
		step,
		pointerScale,
		keyScale,
		format
	};
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
