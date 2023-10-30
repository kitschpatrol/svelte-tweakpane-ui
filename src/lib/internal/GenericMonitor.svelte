<script lang="ts" context="module">
	import type { BaseMonitorParams, MonitorBindingApi } from '@tweakpane/core';
	export type GenericMonitorOptions = Partial<BaseMonitorParams>; // we take care of readonly...
	export type GenericMonitorRef = MonitorBindingApi;
</script>

<script
	lang="ts"
	generics="T extends any, U extends GenericMonitorOptions, V extends GenericMonitorRef = GenericMonitorRef"
>
	import GenericBinding from '$lib/internal/GenericBinding.svelte';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	type $$Props = ComponentProps<GenericBinding<T, U, V>> & {
		/**
		 * Number of visible rows of state history.
		 *
		 * If `bufferSize` is larger, then the value window will scroll once state history exceeds row count.
		 * @default `1` (Or `3` if value is `string` and `multiline` is `true`.)
		 * */
		rows?: number;
		/**
		 * Number of past states to retain.
		 * @default `1` (Or `64` if value is `number` and `graph` is `true`.)
		 * */
		bufferSize?: number;
		/**
		 * Time between value samples in milliseconds.
		 *
		 * Useful when `graph` is true. Defaults to reactive value updates only (`interval={0}`).
		 * @default `0`
		 * */
		interval?: number;
	};

	// reexport for bindability
	export let value: $$Props['value']; // still has to be passed manually since it's required
	export let ref: $$Props['ref'] = undefined;
	export let options: $$Props['options'] = undefined;

	// union of boolean / number / string / object monitor params
	export let rows: $$Props['rows'] = undefined;
	export let bufferSize: $$Props['bufferSize'] = undefined;
	export let interval: $$Props['interval'] = undefined;

	let optionsInternal: GenericMonitorOptions;

	$: BROWSER &&
		(optionsInternal = {
			rows,
			bufferSize,
			interval: interval ?? 0, // zero confirmed as never updating (not same interface as setInterval())
			...options,
			readonly: true
		});
</script>

<!--
@component
This component is for internal use only.

@sourceLink
-->

{#if BROWSER}
	<GenericBinding bind:ref options={optionsInternal} {value} {...$$restProps} />
{/if}
