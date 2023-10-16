<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported

	/** String value to monitor the state of. */
	export let value: string;

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

	// unique

	/** Display multiline strings */
	export let multiline: boolean | undefined = undefined;

	$: bindingParams = {
		multiline
	};
</script>

<!--
@component
Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/) functionality for string values.

Technically, any unbound value on a normal `svelte-tweakpane-ui` component effectivel acts as a monitor, but additional monitor-specific components are provided to expose additional view options (e.g. `multiline`).

Note that `interval` is not exposed because updates are driven by reactive changes in the `value`.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane mode='inline' ...>` component.

Example:	
```tsx
<script lang="ts">
	let stringToMonitor = 'bla\n\bla\nbla';

	setInterval(() => {
		stringToMonitor = stringToMonitor
			.split('\n')
			.map(() => Math.round(Math.random() * 100).toString())
			.join('\n');
	}, 100);
</script>

<MonitorString value={stringToMonitor} multiline={true} />
```
-->

<GenericMonitor {rows} {bufferSize} {label} {disabled} {bindingParams} {value} {theme} {interval} />
