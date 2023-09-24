<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported
	export let value: number;
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let rows: number | undefined = undefined;
	export let bufferSize: number | undefined = undefined;
	export let graph: boolean | undefined = false;
	export let format: ((value: number) => string) | undefined = undefined;
	export let theme: Theme | undefined = undefined;

	// unique
	export let max: number | undefined = undefined;
	export let min: number | undefined = undefined;

	$: bindingParams = {
		view: graph ? 'graph' : undefined,
		max,
		min,
		format
	};
</script>

<GenericMonitor {rows} {bufferSize} {label} {disabled} {bindingParams} {value} {theme} />
