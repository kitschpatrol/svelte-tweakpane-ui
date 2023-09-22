<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;

	// unique
	export let value: boolean = false;
</script>

<GenericInput bind:value {label} {disabled} />
