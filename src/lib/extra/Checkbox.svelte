<script lang="ts">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { BooleanInputParams } from 'tweakpane';

	export let label: string = 'Checkbox';
	export let value: boolean = false;
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
	$: bindingParams = { label } satisfies BooleanInputParams;
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
