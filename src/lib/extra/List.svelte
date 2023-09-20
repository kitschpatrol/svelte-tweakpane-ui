<script lang="ts" generics="T extends string | boolean | number">
	// TODO something to handle bare arrays and transcribe them into ArrayStyleListOptions<T>
	import GenericBinding from '$lib/internal/GenericBinding.svelte';
	import type { ListParamsOptions } from 'tweakpane';

	interface ListInputParams {
		options: ListParamsOptions<T>;
	}

	// re-exported
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;

	// unique
	export let options: ListParamsOptions<T>;
	export let value: T;

	$: bindingParams = {
		options
	} satisfies ListInputParams;
</script>

<GenericBinding bind:value {label} {disabled} {bindingParams} />
