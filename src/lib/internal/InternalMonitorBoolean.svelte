<script lang="ts" context="module">
	import type { BooleanMonitorParams } from '@tweakpane/core';
	export type InternalMonitorBooleanOptions = BooleanMonitorParams;
</script>

<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	// multifile structure is legacy of previous non-dynamic component approach
	// TODO consolidate eventually if dynamic components prove reliable

	type $$Props = Omit<
		ComponentProps<GenericMonitor<boolean, InternalMonitorBooleanOptions>>,
		'options' | 'ref' | 'plugin' | 'interval'
	> & {
		/**
		 * A `boolean` value to monitor.
		 * */
		value: boolean;
	};

	// redeclare for bindability
	export let value: $$Props['value'];
</script>

<!--
@component
This component is for internal use only.

Documentation retained in case of a return to the non-dynamic component approach.

Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/) functionality for boolean values.

Technically, any unbound value on a normal `svelte-tweakpane-ui` component effectivel acts as a monitor, but additional monitor-specific components are provided to expose additional view options (e.g. `rows`).

Note that `interval` is not exposed because updates are driven by reactive changes in the `value`.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane position='inline'>` component.

@example	
```tsx
<script lang="ts">
	import { InternalMonitorBoolean } from 'svelte-tweakpane-ui';

	let booleanToMonitor = false;

	setInterval(() => {
		booleanToMonitor = Math.random() > 0.5;
	}, 100);
</script>

<InternalMonitorBoolean value={booleanToMonitor} rows={5} bufferSize={5} />
```

@sourceLink [InternalMonitorBoolean.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/InternalMonitorBoolean.svelte)
-->

{#if BROWSER}
	<GenericMonitor {value} {...$$restProps} />
{/if}
