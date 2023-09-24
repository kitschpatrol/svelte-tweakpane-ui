<script lang="ts" generics="T extends string | boolean | number">
	// TODO something to handle bare arrays and transcribe them into ArrayStyleListOptions<T>
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { ListParamsOptions } from 'tweakpane';
	import type { Theme } from '$lib/theme.js';

	interface ListInputParams {
		options: ListParamsOptions<T>;
	}

	// re-exported
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let theme: Theme | undefined = undefined;

	// unique
	export let options: ListParamsOptions<T>;
	export let value: T;

	$: bindingParams = {
		options
	} satisfies ListInputParams;
</script>

<GenericInput bind:value {label} {disabled} {bindingParams} {theme} />
