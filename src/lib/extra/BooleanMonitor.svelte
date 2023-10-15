<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported

	/** Boolean balue to monitor state of. */
	export let value: boolean;

	/** Text displayed next to monitor. */
	export let label: string | undefined = undefined;

	/** Prevent interactivity. */
	export let disabled: boolean = false;

	/** Number of visible rows of state history. Only has an effect if `bufferSize` is defined. If `bufferSize` is larger, then the value window will scroll once state history exceeds row count.  */
	export let rows: number | undefined = undefined;

	/** Number of past states to retain.  */
	export let bufferSize: number | undefined = undefined;

	/** Custom color scheme. Only applies if `<BooleanMonitor>` is created outside a `<Pane>` component.  */
	export let theme: Theme | undefined = undefined;
</script>

<GenericMonitor {theme} {rows} {bufferSize} {label} {disabled} {value} />
