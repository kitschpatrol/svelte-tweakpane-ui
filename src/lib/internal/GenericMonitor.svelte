<script lang="ts" generics="T extends any, U extends BindingApi">
	import type { BindingApi } from '@tweakpane/core';
	import GenericBinding from '$lib/internal/GenericBinding.svelte';

	// re-exported
	export let bindingRef: U | undefined = undefined;
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let bindingParams: object | undefined = undefined;
	export let value: T; // note it is NOT bound in monitors

	// union of boolean / number / string monitor params
	export let rows: number | undefined = undefined;
	export let interval: number | undefined = undefined;
	export let bufferSize: number | undefined = undefined;

	$: bindingParamsInternal = {
		rows,
		interval,
		bufferSize,
		...bindingParams,
		readonly: true
	};
</script>

<GenericBinding {label} {disabled} bind:bindingRef bindingParams={bindingParamsInternal} {value} />
