<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let value: string;
</script>

<GenericInput {label} {disabled} bind:value />
