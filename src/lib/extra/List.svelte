<script lang="ts" generics="T extends string | boolean | number">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { BaseInputParams } from '@tweakpane/core';
	import type { ListParamsOptions } from 'tweakpane';

	interface ListInputParams extends BaseInputParams {
		options: ListParamsOptions<T>;
	}

	// TODO something to handle bare arrays and transcribe them into ArrayStyleListOptions<T>

	export let label: string = 'List';
	export let value: T;
	export let options: ListParamsOptions<T>;
	export let disabled: boolean = false;

	let bindingParams: ListInputParams;

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
		label,
		options
	};
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
