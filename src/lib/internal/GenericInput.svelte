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

	interface $$Props extends ComponentProps<GenericBinding<T, U, V>> {}

	export let options: $$Props['options'] = undefined;
	export let ref: $$Props['ref'] = undefined;
	export let value: $$Props['value'];

	$: optionsInternal = {
		...options,
		readonly: false
	} as GenericInputOptions;
</script>

<!--
@component
This component is for internal use only.
-->

<GenericBinding bind:value bind:ref options={optionsInternal} {...$$restProps} />
