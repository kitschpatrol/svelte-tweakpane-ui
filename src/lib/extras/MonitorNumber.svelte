<script lang="ts">
	import GenericMonitor from '../internal/GenericMonitor.svelte';
	import type { ComponentProps } from 'svelte';
	import type { NumberMonitorParams as MonitorNumberOptions } from '@tweakpane/core';

	interface $$Props
		extends Omit<
			ComponentProps<GenericMonitor<number, MonitorNumberOptions>>,
			'options' | 'ref' | 'plugin'
		> {
		/** Display a graph of the value's changes over time  */
		graph?: boolean;
		/** A function to customize the number's formatting (e.g. rounding, etc.)  */
		format?: (value: number) => string;
		/** Maximum bound when `graph` is true  */
		max?: number;
		/** Minimum bound when `graph` is true  */
		min?: number;
		/** TODO */
		value: number;
	}

	// must redeclare to pass required prop
	export let value: $$Props['value'];

	// unique
	export let graph: $$Props['graph'] = undefined;
	export let format: $$Props['format'] = undefined;
	export let max: $$Props['max'] = undefined;
	export let min: $$Props['min'] = undefined;

	$: options = {
		view: graph ? 'graph' : undefined,
		max,
		min,
		format
	} as MonitorNumberOptions;
</script>

<!--
@component
Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/) functionality for number values.

Technically, any unbound value on a normal `svelte-tweakpane-ui` component effectivel acts as a monitor, but additional monitor-specific components are provided to expose additional view options (e.g. `max` and `min`).

Note that `interval` is exposed to allow separate control over the reactive value's update rate and the graph's update rate.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane position='inline' ...>` component.

Example:	
```tsx

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

<GenericMonitor {value} {options} {...$$restProps} />
