<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let value: string;

	// unique
	export let rows: number | undefined = undefined;
	export let placeholder: string | undefined = undefined;

	$: bindingParams = {
		view: 'textarea',
		rows,
		placeholder
	};
</script>

<GenericInput {label} {disabled} {bindingParams} bind:value />
