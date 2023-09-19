<script lang="ts">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { NumberInputParams } from 'tweakpane';

	export let label: string = 'Slider';
	export let value: number;
	export let disabled: boolean = false;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let step: number | undefined = undefined;
	export let pointerScale: number | undefined = undefined;
	export let keyScale: number | undefined = undefined;
	export let format: ((value: number) => string) | undefined = undefined;

	// avoid circular
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
	} satisfies NumberInputParams;
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
