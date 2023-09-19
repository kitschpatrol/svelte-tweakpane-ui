<script lang="ts">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { PickerLayout } from '@tweakpane/core';
	import type { ListParamsOptions } from 'tweakpane';

	export let label: string = 'Dropdown';

	export let value: string | boolean | number;

	// TODO something to handle bare arrays and transcribe them into ArrayStyleListOptions<T>
	export let options: ListParamsOptions<typeof value>;
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
		options,
		label
	}; // todo, type?
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
