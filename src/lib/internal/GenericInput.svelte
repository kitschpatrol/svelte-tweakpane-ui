<script lang="ts" generics="T extends any">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars

	import GenericBinding from '$lib/internal/GenericBinding.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props extends ComponentProps<GenericBinding<T>> {}

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
