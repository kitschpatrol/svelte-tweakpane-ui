<script lang="ts" generics="W extends number | string | boolean | unknown">
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';
	import type {
		default as GenericMonitor,
		GenericMonitorOptions
	} from '../internal/GenericMonitor.svelte';
	import InternalMonitorBoolean, {
		type InternalMonitorBooleanOptions
	} from '../internal/InternalMonitorBoolean.svelte';
	import InternalMonitorNumber, {
		type InternalMonitorNumberOptions
	} from '../internal/InternalMonitorNumber.svelte';
	import InternalMonitorString, {
		type InternalMonitorStringOptions
	} from '../internal/InternalMonitorString.svelte';

	// multifile structure is legacy of previous non-dynamic component approach
	// TODO consolidate eventually if dynamic components prove reliable

	type optionsForType<U> = U extends string
		? InternalMonitorStringOptions
		: U extends boolean
		? InternalMonitorBooleanOptions
		: U extends number
		? InternalMonitorNumberOptions
		: GenericMonitorOptions;

	type propsForType<U> = U extends string
		? ComponentProps<InternalMonitorString>
		: U extends boolean
		? ComponentProps<InternalMonitorBoolean>
		: U extends number
		? ComponentProps<InternalMonitorNumber>
		: {
				/**
				 * A value to monitor.
				 * @bindable
				 * */
				value: number | string | boolean;
		  };

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = Omit<
		ComponentProps<GenericMonitor<W, optionsForType<W>>>,
		'options' | 'ref' | 'plugin' | 'value'
	> &
		propsForType<W>;

	// must redeclare to pass required prop
	export let value: $$Props['value'];
</script>

<!--
@component
Wraps the Tweakpane [monitor binding](https://tweakpane.github.io/docs/monitor-bindings/) functionality for `boolean`, `number`, and `string` values.

Technically, any unbound value on a normal `svelte-tweakpane-ui` component effectively acts as a monitor, but additional monitor-specific components are provided to expose additional view options (e.g. `rows`).

`<Monitor>` is a dynamic component, and the availability of additional props will vary depending on the type of the defined `value`

Note that `interval` is not exposed on `boolean` and `string` monitors because updates are driven by reactive changes in the `value`.

However, `interval` _is_ exposed on `number` monitors Note to allow independent control over the reactive value's update rate and the graph's update rate.

See also the `<Waveform>` component for a more advanced number visualization.

Usage outside of a `<Pane>` component will implicitly wrap the monitor in a `<Pane position='inline'>` component.

@example	
```tsx
<script lang="ts">
	import { Monitor } from 'svelte-tweakpane-ui';

	let booleanToMonitor = false;
  let stringToMonitor = "Reticulating";
  let numberToMonitor = 85;

	setInterval(() => {
		numberToMonitor = Math.random() * 100;
	}, 50);

	setInterval(() => {
		boolToMonitor = !boolToMonitor;
		stringToMonitor = stringToMonitor.split('').reverse().join('');
	}, 1000);
</script>

<Monitor value={numberToMonitor} graph={true} />
<Monitor label="Boolean Monitor" value={boolToMonitor} />
<Monitor label="String Monitor" value={stringToMonitor} multiline={true} bufferSize={5} />
```

@sourceLink
-->

{#if BROWSER}
	{#if value === undefined || typeof value === 'number'}
		<InternalMonitorNumber {value} {...$$restProps} />
	{:else if typeof value === 'boolean'}
		<InternalMonitorBoolean {value} {...$$restProps} />
	{:else if typeof value === 'string'}
		<InternalMonitorString {value} {...$$restProps} />
	{/if}
{/if}
