<script lang="ts" generics="T extends any">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BindingApi } from '@tweakpane/core';

	import GenericBinding from '$lib/internal/GenericBinding.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props extends ComponentProps<GenericBinding<T, BindingApi>> {
		// unique props
		/** Number of visible rows of state history. Only has an effect if `bufferSize` is defined. If `bufferSize` is larger, then the value window will scroll once state history exceeds row count. */
		rows?: number;
		/** Number of past states to retain. */
		bufferSize?: number;
		/** Time between value samples in milliseconds, useful when `graph` is true. Defaults to reactive value updates only (`interval={0}`). */
		interval?: number;
	}

	// must redeclare for bindability
	export let value: $$Props['value']; // still has to be passed manually since it's required
	export let bindingRef: $$Props['bindingRef'] = undefined;
	export let bindingParams: $$Props['bindingParams'] = undefined;

	// union of boolean / number / string / object monitor params
	export let rows: $$Props['rows'] = undefined;
	export let bufferSize: $$Props['bufferSize'] = undefined;
	export let interval: $$Props['interval'] = undefined;

	$: bindingParamsInternal = {
		rows,
		bufferSize,
		interval: interval ?? 0, // zero confirmed as never updating (not same interface as setInterval())
		...bindingParams,
		readonly: true
	};
</script>

<!--
@component
This component is for internal use only.
-->

<GenericBinding bind:bindingRef bindingParams={bindingParamsInternal} {value} {...$$restProps} />
