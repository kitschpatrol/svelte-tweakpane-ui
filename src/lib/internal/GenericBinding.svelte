<script lang="ts" generics="T extends any, U extends BindingApi">
	// Abstracts the param object into a bare value
	import Binding from '$lib/core/Binding.svelte';
	import type { BindingApi } from '@tweakpane/core';
	import { makeSafeKey } from '$lib/utils.js';
	import type { Theme } from '$lib/theme.js';

	// re-exported
	export let bindingRef: U | undefined = undefined;
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let bindingParams: object | undefined = undefined;
	export let theme: Theme | undefined = undefined;

	// unique
	export let value: T; // bindable

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
</script>

<Binding {theme} {disabled} {label} bind:bindingRef bind:params {key} {bindingParams} />
