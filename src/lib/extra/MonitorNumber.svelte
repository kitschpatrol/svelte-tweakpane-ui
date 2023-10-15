<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported

	/** Number value to monitor the state of. */
	export let value: number;

	/** Text displayed next to monitor. */
	export let label: string | undefined = undefined;

	/** Prevent interactivity. */
	export let disabled: boolean = false;

	/** Number of visible rows of state history. Only has an effect if `bufferSize` is defined. If `bufferSize` is larger, then the value window will scroll once state history exceeds row count.  */
	export let rows: number | undefined = undefined;

	/** Number of past states to retain.  */
	export let bufferSize: number | undefined = undefined;

	/** Time between value samples in milliseconds, useful when `graph` is true. Defaults to reactive value updates only (`interval={0}`). */
	export let interval: number = 0;

	/** Custom color scheme. Only applies if `<MonitorNumber>` is created outside a `<Pane>` component.  */
	export let theme: Theme | undefined = undefined;

	// unique

	/** Display a graph of the value's changes over time  */
	export let graph: boolean | undefined = false;

	/** A function to customize the number's formatting (e.g. rounding, etc.)  */
	export let format: ((value: number) => string) | undefined = undefined;

	/** Maximum bound when `graph` is true  */
	export let max: number | undefined = undefined;

	/** Minimum bound when `graph` is true  */
	export let min: number | undefined = undefined;

	$: bindingParams = {
		view: graph ? 'graph' : undefined,
		max,
		min,
		format
	};
</script>

<!--
@component
Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/) functionality for number values.

Technically, any unbound value on a normal `svelte-tweakpane-ui` component effectivel acts as a monitor, but additional monitor-specific components are provided to expose additional view options (e.g. `max` and `min`).

Note that `interval` is exposed to allow separate control over the reactive value's update rate and the graph's update rate.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane mode='inline' ...>` component.

Example:	
  ```tsx
	<script>
		let numberToMonitor = 0;
		let t = 0;
	
		setInterval(() => {
			numberToMonitor = Math.sin(t);
			t += 0.3;
		}, 50);
	</script>

	<MonitorNumber value={numberToMonitor} graph={true} min={-1} max={1} />
	```
-->

<GenericMonitor {rows} {bufferSize} {label} {disabled} {bindingParams} {value} {theme} {interval} />
