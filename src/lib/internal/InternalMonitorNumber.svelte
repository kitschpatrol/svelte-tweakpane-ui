<script context="module" lang="ts">
	import type { NumberMonitorParams } from '@tweakpane/core';
	export type InternalMonitorNumberOptions = NumberMonitorParams;
</script>

<script lang="ts">
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import { fillWith, rowsForMonitor } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	// Multi-file structure is legacy of previous non-dynamic component approach TODO consolidate
	// eventually if dynamic components prove reliable

	type $$Props = Omit<
		ComponentProps<GenericMonitor<number, InternalMonitorNumberOptions>>,
		'options' | 'plugin' | 'ref'
	> & {
		/**
		 * A `number` value to monitor.
		 * */
		value: number;
		/**
		 * Minimum bound when `graph` is true.
		 * @default `0`
		 */
		min?: number;
		/**
		 * Maximum bound when `graph` is true.
		 * @default `100`
		 * */
		max?: number;
		/**
		 * A function to customize the number's string representation (e.g. rounding, etc.).
		 * @default `undefined`  \
		 * Normal `.toString()` formatting.
		 * */
		format?: (value: number) => string;
		/**
		 * Display a graph of the value's changes over time.
		 * @default `false`
		 * */
		graph?: boolean;
	};

	// Redeclare for bindability
	export let value: $$Props['value'];

	// Unique
	export let graph: $$Props['graph'] = undefined;
	export let format: $$Props['format'] = undefined;
	export let max: $$Props['max'] = undefined;
	export let min: $$Props['min'] = undefined;

	let options: InternalMonitorNumberOptions;

	// Deal with format firing a change firing even when the function hasn't changed probably
	// related to https://github.com/sveltejs/svelte/issues/4265 possibly fixable with
	// immutable=true but I don't want to go there TODO evaluate other non-primitive prop access
	let formatProxy: typeof format = format;

	$: formatProxy !== format && (formatProxy = format);
	$: options = {
		min,
		max,
		format: formatProxy,
		readonly: true,
		view: graph ? 'graph' : undefined
	};
</script>

<!--
@component  
This component is for internal use only.

Documentation retained in case of a return to the non-dynamic component approach.

Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/)
functionality for number values.

Technically, any unbound value on a normal _Svelte Tweakpane UI_ component effectively acts as a
monitor, but additional monitor-specific components are provided to expose additional view options
(e.g. `max` and `min`).

Note that `interval` is exposed to allow separate control over the reactive value's update rate and
the graph's update rate.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane
position="inline">` component.

@example  
```svelte
<script lang="ts">
  import { InternalMonitorNumber } from 'svelte-tweakpane-ui';

  let numberToMonitor = 0;
  let t = 0;

  setInterval(() => {
    numberToMonitor = Math.sin(t);
    t += 0.3;
  }, 100);
</script>

<InternalMonitorNumber
  value={numberToMonitor}
  min={-1}
  max={1}
  graph={true}
/>
```

@sourceLink
[InternalMonitorNumber.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/InternalMonitorNumber.svelte)
-->

<GenericMonitor {value} {options} {...$$restProps} />
{#if !BROWSER}
	{@const totalRows = rowsForMonitor($$props.bufferSize, $$props.rows, graph) - 1}
	{#if totalRows > 0}
		<ClsPad keysAdd={fillWith('containerUnitSize', totalRows)} theme={$$props.theme} />
	{/if}
{/if}
