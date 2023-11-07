<script context="module" lang="ts">
	import type { BaseInputParams, InputBindingApi } from '@tweakpane/core';
	export type GenericInputOptions = BaseInputParams;
	export type GenericInputRef = InputBindingApi;
</script>

<script
	generics="T extends any, U extends GenericInputOptions = GenericInputOptions, V extends GenericInputRef = GenericInputRef"
	lang="ts"
>
	import GenericBinding from '$lib/internal/GenericBinding.svelte';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

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

@sourceLink [GenericInput.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericInput.svelte)
-->

{#if BROWSER}
	<GenericBinding bind:value bind:ref options={optionsInternal} {...$$restProps} />
{/if}
