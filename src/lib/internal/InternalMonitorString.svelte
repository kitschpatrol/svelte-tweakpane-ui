<script context="module" lang="ts">
	import type { StringMonitorParams } from '@tweakpane/core';
	export type InternalMonitorStringOptions = StringMonitorParams;
</script>

<script lang="ts">
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import { fillWith, rowsForMonitor } from '$lib/utils';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	// multi-file structure is legacy of previous non-dynamic component approach TODO consolidate
	// eventually if dynamic components prove reliable

	type $$Props = Omit<
		ComponentProps<GenericMonitor<string, InternalMonitorStringOptions>>,
		'interval' | 'options' | 'plugin' | 'ref'
	> & {
		/**
		 * A `string` value to monitor.
		 * */
		value: string;
		/**
		 * Display multiline strings.
		 * @default `false`
		 * */
		multiline?: boolean;
	};

	// redeclare for bindability
	export let value: $$Props['value'];
	export let multiline: $$Props['multiline'] = undefined;

	let options: InternalMonitorStringOptions;

	$: options = {
		multiline,
		readonly: true
	};
</script>

<!--
@component  
This component is for internal use only.

Documentation retained in case of a return to the non-dynamic component approach.

Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/)
functionality for string values.

Technically, any unbound value on a normal _Svelte Tweakpane UI_ component effectively acts as a
monitor, but additional monitor-specific components are provided to expose additional view options
(e.g. `multiline`).

Note that `interval` is not exposed because updates are driven by reactive changes in the `value`.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane
position='inline'>` component.

@example  
```svelte
<script lang="ts">
  import { InternalMonitorString } from 'svelte-tweakpane-ui';

  let stringToMonitor = 'bla\n\bla\nbla';

  setInterval(() => {
    stringToMonitor = stringToMonitor
      .split('\n')
      .map(() => Math.round(Math.random() * 100).toString())
      .join('\n');
  }, 100);
</script>

<InternalMonitorString value={stringToMonitor} multiline={true} />
```

@sourceLink
[InternalMonitorString.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/InternalMonitorString.svelte)
-->

<GenericMonitor {value} {options} {...$$restProps} />
{#if !BROWSER}
	{@const totalRows = rowsForMonitor($$props.bufferSize, $$props.rows, multiline) - 1}
	{#if totalRows > 0}
		<ClsPad keysAdd={fillWith('containerUnitSize', totalRows)} theme={$$props.theme} />
	{/if}
{/if}
