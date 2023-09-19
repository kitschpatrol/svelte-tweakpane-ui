<script lang="ts">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { StringInputParams } from 'tweakpane';

	export let label: string = 'Text';
	export let value: string;
	export let disabled: boolean = false;

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
		label
	} satisfies StringInputParams;
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
