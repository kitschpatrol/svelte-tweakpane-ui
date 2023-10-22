<script lang="ts" context="module">
	import type { BaseMonitorParams, MonitorBindingApi } from '@tweakpane/core';
	export type GenericMonitorOptions = BaseMonitorParams;
	export type GenericMonitorRef = MonitorBindingApi;
</script>

<script
	lang="ts"
	generics="T extends any, U extends GenericMonitorOptions, V extends GenericMonitorRef = GenericMonitorRef"
>
	import GenericBinding from './GenericBinding.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props extends ComponentProps<GenericBinding<T, U, V>> {
		/** Number of visible rows of state history. Only has an effect if `bufferSize` is defined. If `bufferSize` is larger, then the value window will scroll once state history exceeds row count. */
		rows?: number;
		/** Number of past states to retain. */
		bufferSize?: number;
		/** Time between value samples in milliseconds, useful when `graph` is true. Defaults to reactive value updates only (`interval={0}`). */
		interval?: number;
	}

	// must redeclare for bindability
	export let value: $$Props['value']; // still has to be passed manually since it's required
	export let ref: $$Props['ref'] = undefined;
	export let options: $$Props['options'] = undefined;

	// union of boolean / number / string / object monitor params
	export let rows: $$Props['rows'] = undefined;
	export let bufferSize: $$Props['bufferSize'] = undefined;
	export let interval: $$Props['interval'] = undefined;

	$: optionsInternal = {
		rows,
		bufferSize,
		interval: interval ?? 0, // zero confirmed as never updating (not same interface as setInterval())
		...options,
		readonly: true
	} as GenericMonitorOptions;
</script>

<!--
@component
This component is for internal use only.
-->

<GenericBinding bind:ref options={optionsInternal} {value} {...$$restProps} />
