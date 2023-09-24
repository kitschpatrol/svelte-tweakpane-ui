<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported
	export let value: boolean;
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let rows: number | undefined = undefined;
	export let bufferSize: number | undefined = undefined;
	export let theme: Theme | undefined = undefined;
</script>

<GenericMonitor {theme} {rows} {bufferSize} {label} {disabled} {value} />
