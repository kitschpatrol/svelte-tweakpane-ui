<script lang="ts" generics="U extends number | IntervalObject">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { NumberInputParams } from 'tweakpane';
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';

	// Note that we go from a regular slider to a rang / interval slider
	// (via the essentials plugin) just by changing the input type
	// For the sake of consistency and discoverability, Interval
	// is implement as a separate componetn leveraging this generic
	export let value: U; // bindable
	export let label: string | undefined = undefined;
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
		label,
		min,
		max,
		step,
		pointerScale,
		keyScale,
		format
	};
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
