<script lang="ts" context="module">
	import type { InputBindingApi, BaseInputParams } from '@tweakpane/core';
	export type GenericInputOptions = BaseInputParams;
	export type GenericInputRef = InputBindingApi;
</script>

<script
	lang="ts"
	generics="T extends any, U extends GenericInputOptions = GenericInputOptions, V extends GenericInputRef = GenericInputRef"
>
	import GenericBinding from './GenericBinding.svelte';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	type $$Props = ComponentProps<GenericBinding<T, U, V>>;

	// reexport for bindability
	export let options: $$Props['options'] = undefined;
	export let ref: $$Props['ref'] = undefined;
	export let value: $$Props['value'];

	let optionsInternal: GenericInputOptions;

	$: BROWSER &&
		(optionsInternal = {
			...options,
			readonly: false
		});
</script>

<!--
@component
This component is for internal use only.

@sourceLink
-->

{#if BROWSER}
	<GenericBinding bind:value bind:ref options={optionsInternal} {...$$restProps} />
{/if}
