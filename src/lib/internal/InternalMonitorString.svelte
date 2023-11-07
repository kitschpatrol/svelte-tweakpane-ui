<script context="module" lang="ts">
	import type { StringMonitorParams } from '@tweakpane/core';
	export type InternalMonitorStringOptions = Partial<StringMonitorParams>;
</script>

<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	// multifile structure is legacy of previous non-dynamic component approach
	// TODO consolidate eventually if dynamic components prove reliable

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

	$: BROWSER &&
		(options = {
			multiline
		});
</script>

<!--
@component
This component is for internal use only.

Documentation retained in case of a return to the non-dynamic component approach.

Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/) functionality for string values.

Technically, any unbound value on a normal `svelte-tweakpane-ui` component effectivel acts as a monitor, but additional monitor-specific components are provided to expose additional view options (e.g. `multiline`).

Note that `interval` is not exposed because updates are driven by reactive changes in the `value`.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane position='inline'>` component.

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

@sourceLink [InternalMonitorString.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/InternalMonitorString.svelte)
-->

{#if BROWSER}
	<GenericMonitor {value} {options} {...$$restProps} />
{/if}
