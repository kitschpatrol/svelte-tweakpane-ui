<script lang="ts">
	import GenericBinding from '$lib/internal/GenericBinding.svelte';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let value: string;
</script>

<GenericBinding {label} {disabled} bind:value />
