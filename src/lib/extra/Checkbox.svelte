<script lang="ts">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';

	//
	import type { BooleanInputParams } from 'tweakpane';

	export let label: string | undefined = undefined;
	export let value: boolean = false;
	export let disabled: boolean = false;

	// ToDO Omit<BooleanInputParams, 'options'>;?
	let bindingParams: BooleanInputParams;

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
</script>

<Binding {label} {disabled} bind:params {key} {bindingParams} />
