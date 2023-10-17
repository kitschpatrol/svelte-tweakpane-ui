<script lang="ts" generics="T extends any, U extends BindingApi">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BindingApi } from '@tweakpane/core';

	import GenericBinding from '$lib/internal/GenericBinding.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props extends ComponentProps<GenericBinding<T, U>> {}

	export let bindingParams: $$Props['bindingParams'] = undefined;
	export let bindingRef: $$Props['bindingRef'] = undefined;
	export let value: $$Props['value'];

	$: bindingParamsInternal = {
		...bindingParams,
		readonly: false
	};
</script>

<!--
@component
This component is for internal use only.
-->

<GenericBinding bind:value bind:bindingRef bindingParams={bindingParamsInternal} {...$$restProps} />
