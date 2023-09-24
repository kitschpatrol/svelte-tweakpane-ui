<script lang="ts" generics="T extends any, U extends BindingApi">
	import GenericBinding from '$lib/internal/GenericBinding.svelte';
	import type { BindingApi } from '@tweakpane/core';
	import type { Theme } from '$lib/theme.js';

	// re-exported
	export let bindingRef: U | undefined = undefined;
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let bindingParams: object | undefined = undefined;
	export let theme: Theme | undefined = undefined;
	export let value: T; //bound

	// TODO are there input-specific items not captured above?

	$: bindingParamsInternal = {
		...bindingParams,
		readonly: false
	};
</script>

<GenericBinding
	{theme}
	{label}
	{disabled}
	bind:bindingRef
	bindingParams={bindingParamsInternal}
	bind:value
/>
