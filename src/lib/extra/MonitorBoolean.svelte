<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported

	/** Boolean value to monitor the state of. */
	export let value: boolean;

	/** Text displayed next to monitor. */
	export let label: string | undefined = undefined;

	/** Prevent interactivity. Defaults to `false`. */
	export let disabled: boolean = false;

	/** Number of visible rows of state history. Only has an effect if `bufferSize` is defined. If `bufferSize` is larger, then the value window will scroll once state history exceeds row count. */
	export let rows: number | undefined = undefined;

	/** Number of past states to retain. */
	export let bufferSize: number | undefined = undefined;

	/** Time between value samples in milliseconds. Defaults to reactive value updates only (`interval={0}`). */
	export let interval: number = 0;

	/** Custom color scheme. Only applies if `<MonitorBoolean>` is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;

	// no unique params
</script>

<!--
@component
Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/) functionality for boolean values.

Technically, any unbound value on a normal `svelte-tweakpane-ui` component effectivel acts as a monitor, but additional monitor-specific components are provided to expose additional view options (e.g. `rows`).

Note that `interval` is not exposed because updates are driven by reactive changes in the `value`.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane mode='inline' ...>` component.

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

<GenericMonitor {theme} {rows} {bufferSize} {label} {disabled} {value} {interval} />
