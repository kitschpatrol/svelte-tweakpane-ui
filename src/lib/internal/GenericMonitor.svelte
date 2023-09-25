<script lang="ts" generics="T extends any, U extends BindingApi">
	import type { BindingApi } from '@tweakpane/core';
	import GenericBinding from '$lib/internal/GenericBinding.svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported
	export let bindingRef: U | undefined = undefined;
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let bindingParams: object | undefined = undefined;
	export let theme: Theme | undefined = undefined;
	export let value: T; // note it is NOT bound in monitors

	// union of boolean / number / string monitor params
	export let rows: number | undefined = undefined;
	export let bufferSize: number | undefined = undefined;

	$: bindingParamsInternal = {
		rows,
		bufferSize,
		...bindingParams,
		readonly: true,
		interval: -1 // TODO does this work?
	};
</script>

<GenericBinding
	{theme}
	{label}
	{disabled}
	bind:bindingRef
	bindingParams={bindingParamsInternal}
	{value}
/>