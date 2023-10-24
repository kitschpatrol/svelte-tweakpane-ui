<script lang="ts" context="module">
	import type { BooleanMonitorParams } from '@tweakpane/core';
	export type InternalMonitorBooleanOptions = BooleanMonitorParams;
</script>

<script lang="ts">
	import GenericMonitor from './GenericMonitor.svelte';
	import type { ComponentProps } from 'svelte';

	// multifile structure is legacy of previous non-dynamic component approach
	// TODO consolidate eventually if dynamic components prove reliable

	interface $$Props
		extends Omit<
			ComponentProps<GenericMonitor<boolean, InternalMonitorBooleanOptions>>,
			'options' | 'ref' | 'plugin' | 'interval'
		> {
		/** Boolean value to monitor. */
		value: boolean;
	}

	// must redeclare to pass required prop
	export let value: $$Props['value'];
</script>

<!--
@component
This component is for internal use only.

Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/) functionality for boolean values.

Technically, any unbound value on a normal `svelte-tweakpane-ui` component effectivel acts as a monitor, but additional monitor-specific components are provided to expose additional view options (e.g. `rows`).

Note that `interval` is not exposed because updates are driven by reactive changes in the `value`.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane position='inline'>` component.

Example:	
```tsx
<script lang="ts">
	let booleanToMonitor = false;

	setInterval(() => {
		booleanToMonitor = Math.random() > 0.5;
	}, 100);
</script>

<InternalMonitorBoolean value={booleanToMonitor} rows={5} bufferSize={5} />
```

@sourceLink
-->

<GenericMonitor {value} {...$$restProps} />
