<script context="module" lang="ts">
	import type { BooleanMonitorParams } from '@tweakpane/core';
	export type InternalMonitorBooleanOptions = BooleanMonitorParams;
</script>

<script lang="ts">
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import { fillWith, rowsForMonitor } from '$lib/utils';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	// Multi-file structure is legacy of previous non-dynamic component approach TODO consolidate
	// eventually if dynamic components prove reliable

	type $$Props = {
		/**
		 * A `boolean` value to monitor.
		 * */
		value: boolean;
	} & Omit<
		ComponentProps<GenericMonitor<boolean, InternalMonitorBooleanOptions>>,
		'interval' | 'options' | 'plugin' | 'ref'
	>;

	// Redeclare for bindability
	export let value: $$Props['value'];
</script>

<!--
@component  
This component is for internal use only.

Documentation retained in case of a return to the non-dynamic component approach.

Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/)
functionality for boolean values.

Technically, any unbound value on a normal _Svelte Tweakpane UI_ component effectively acts as a
monitor, but additional monitor-specific components are provided to expose additional view options
(e.g. `rows`).

Note that `interval` is not exposed because updates are driven by reactive changes in the `value`.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane
position="inline">` component.

@example  
```svelte
<script lang="ts">
  import { InternalMonitorBoolean } from 'svelte-tweakpane-ui';

  let booleanToMonitor = false;

  setInterval(() => {
    booleanToMonitor = Math.random() > 0.5;
  }, 100);
</script>

<InternalMonitorBoolean value={booleanToMonitor} bufferSize={5} rows={5} />
```

@sourceLink
[InternalMonitorBoolean.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/InternalMonitorBoolean.svelte)
-->

<GenericMonitor {value} {...$$restProps} />
{#if !BROWSER}
	{@const totalRows = rowsForMonitor($$props.bufferSize, $$props.rows) - 1}
	{#if totalRows > 0}
		<ClsPad keysAdd={fillWith('containerUnitSize', totalRows)} theme={$$props.theme} />
	{/if}
{/if}
