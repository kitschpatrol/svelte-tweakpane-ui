<script lang="ts">
	import GenericBinding from '$lib/internal/GenericBinding.svelte';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;

	// unique
	export let value: boolean = false;
</script>

<GenericBinding bind:value {label} {disabled} />
