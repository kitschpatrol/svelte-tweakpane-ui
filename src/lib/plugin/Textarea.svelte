<script lang="ts">
	import GenericInput from '../internal/GenericInput.svelte';
	import type { Theme } from '../theme.js';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;
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

<GenericInput {label} {disabled} {bindingParams} {theme} bind:value />
