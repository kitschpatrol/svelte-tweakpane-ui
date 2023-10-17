<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<ComponentProps<GenericMonitor<boolean>>, 'bindingParams' | 'bindingRef'> {
		// no unique params
	}

	// must redeclare to pass required prop
	export let value: $$Props['value'];
</script>

<!--
@component
Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/) functionality for boolean values.

Technically, any unbound value on a normal `svelte-tweakpane-ui` component effectivel acts as a monitor, but additional monitor-specific components are provided to expose additional view options (e.g. `rows`).

Note that `interval` is not exposed because updates are driven by reactive changes in the `value`.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane position='inline' ...>` component.

Example:	
```tsx
<script lang="ts">
	let booleanToMonitor = false;

	setInterval(() => {
		booleanToMonitor = Math.random() > 0.5;
	}, 100);
</script>

<MonitorBoolean value={booleanToMonitor} rows={5} bufferSize={5} />
```
-->

<GenericMonitor {value} {...$$restProps} />
