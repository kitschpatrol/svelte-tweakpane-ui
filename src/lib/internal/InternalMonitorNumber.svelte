<script lang="ts" context="module">
	import type { NumberMonitorParams } from '@tweakpane/core';
	export type InternalMonitorNumberOptions = NumberMonitorParams;
</script>

<script lang="ts">
	import GenericMonitor from './GenericMonitor.svelte';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	// multifile structure is legacy of previous non-dynamic component approach
	// TODO consolidate eventually if dynamic components prove reliable

	interface $$Props
		extends Omit<
			ComponentProps<GenericMonitor<number, InternalMonitorNumberOptions>>,
			'options' | 'ref' | 'plugin'
		> {
		/**
		 * Display a graph of the value's changes over time.
		 * @default `false`
		 * */
		graph?: boolean;
		/**
		 * A function to customize the number's formatting (e.g. rounding, etc.).
		 * @default `undefined` (normal `.toString()` formatting)
		 * */
		format?: (value: number) => string;
		/**
		 * Maximum bound when `graph` is true.
		 * @default `100`
		 * */
		max?: number;
		/**
		 * Minimum bound when `graph` is true.
		 * @default `0`
		 */
		min?: number;
		/**
		 * A `number` value to monitor.
		 * */
		value: number;
	}

	// redeclare for bindability
	export let value: $$Props['value'];

	// unique
	export let graph: $$Props['graph'] = undefined;
	export let format: $$Props['format'] = undefined;
	export let max: $$Props['max'] = undefined;
	export let min: $$Props['min'] = undefined;

	let options: InternalMonitorNumberOptions;

	// deal with format firing a change
	// firing even when the function hasn't changed
	// probably related to https://github.com/sveltejs/svelte/issues/4265
	// possibly fixable with immutable=true but I don't want to go there
	// TODO evaluate other non-primitive prop access
	let formatProxy: typeof format = format;

	$: BROWSER && formatProxy !== format && (formatProxy = format);
	$: BROWSER &&
		(options = {
			view: graph ? 'graph' : undefined,
			max,
			min,
			format: formatProxy
		} as InternalMonitorNumberOptions);
</script>

<!--
@component
This component is for internal use only.

Documentation retained in case of a return to the non-dynamic component approach.

Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/) functionality for number values.

Technically, any unbound value on a normal `svelte-tweakpane-ui` component effectivel acts as a monitor, but additional monitor-specific components are provided to expose additional view options (e.g. `max` and `min`).

Note that `interval` is exposed to allow separate control over the reactive value's update rate and the graph's update rate.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane position='inline'>` component.

@example	
```tsx
<script lang="ts">
	import { InternalMonitorNumber  } from 'svelte-tweakpane-ui';

	let numberToMonitor = 0;
	let t = 0;

	setInterval(() => {
		numberToMonitor = Math.sin(t);
		t += 0.3;
	}, 50);
</script>

<InternalMonitorNumber value={numberToMonitor} graph={true} min={-1} max={1} />
```

@sourceLink
-->

{#if BROWSER}
	<GenericMonitor {value} {options} {...$$restProps} />
{/if}
