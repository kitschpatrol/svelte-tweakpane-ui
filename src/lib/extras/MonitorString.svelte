<script lang="ts">
	import GenericMonitor from '../internal/GenericMonitor.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<
			ComponentProps<GenericMonitor<string>>,
			'bindingParams' | 'bindingRef' | 'plugin'
		> {
		/** Display multiline strings */
		multiline?: boolean;
	}

	// must redeclare to pass required prop
	export let value: $$Props['value'];

	export let multiline: $$Props['multiline'] = undefined;

	$: bindingParams = {
		multiline
	};
</script>

<!--
@component
Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/) functionality for string values.

Technically, any unbound value on a normal `svelte-tweakpane-ui` component effectivel acts as a monitor, but additional monitor-specific components are provided to expose additional view options (e.g. `multiline`).

Note that `interval` is not exposed because updates are driven by reactive changes in the `value`.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane position='inline' ...>` component.

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

<GenericMonitor {bindingParams} {value} {...$$restProps} />
