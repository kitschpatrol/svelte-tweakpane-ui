<script context="module" lang="ts">
	import type { BaseInputParams, InputBindingApi } from '@tweakpane/core';
	export type GenericInputOptions = BaseInputParams;
	export type GenericInputRef = InputBindingApi;
</script>

<script
	generics="T extends any, U extends GenericInputOptions = GenericInputOptions, V extends GenericInputRef = GenericInputRef"
	lang="ts"
>
	import type { ComponentProps } from 'svelte';
	import GenericBinding from '$lib/internal/GenericBinding.svelte';

	type $$Props = ComponentProps<GenericBinding<T, U, V>>;

	// Reexport for bindability
	export let options: $$Props['options'] = undefined;
	export let ref: $$Props['ref'] = undefined;
	export let value: $$Props['value'];

	let optionsInternal: GenericInputOptions;

	$: optionsInternal = {
		...options,
		readonly: false
	};
</script>

<!--
@component  
This component is for internal use only.

@sourceLink
[GenericInput.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericInput.svelte)
-->

<GenericBinding bind:value bind:ref on:change options={optionsInternal} {...$$restProps} />
