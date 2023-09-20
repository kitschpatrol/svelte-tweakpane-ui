<script lang="ts" generics="T extends any, U extends BindingApi">
	import Binding from '$lib/core/Binding.svelte';
	import type { BaseInputParams, BindingApi } from '@tweakpane/core';
	import { makeSafeKey } from '$lib/utils.js';

	export let value: T; // bindable
	export let disabled: boolean = false;
	export let bindingRef: U | undefined = undefined;
	export let label: string | undefined = undefined;
	export let bindingParams: object | undefined = undefined;

	function getValue(): T {
		return value;
	}

	function setValue() {
		params[key] = value;
	}

	$: key = makeSafeKey(label);
	$: params = { [key]: getValue() };
	$: value = params[key];
	$: value, setValue();
	$: {
		console.log(`value: ${value}`);
	}
</script>

<Binding {disabled} {label} bind:bindingRef bind:params {key} {bindingParams} />
