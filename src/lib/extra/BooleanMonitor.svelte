<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';

	// re-exported
	export let value: boolean;
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let rows: number | undefined = undefined;
	export let bufferSize: number | undefined = undefined;
</script>

<GenericMonitor {rows} {bufferSize} {label} {disabled} {value} />
