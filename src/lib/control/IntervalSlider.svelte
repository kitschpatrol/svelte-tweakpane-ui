<script context="module" lang="ts">
	import type { Simplify } from '$lib/utils';
	import type { ValueChangeEvent } from '$lib/utils.js';

	export type IntervalSliderValueTuple = [min: number, max: number];
	export type IntervalSliderValueObject = {
		min: number;
		max: number;
	};
	export type IntervalSliderValue = Simplify<IntervalSliderValueObject | IntervalSliderValueTuple>;

	export type IntervalSliderChangeEvent = ValueChangeEvent<IntervalSliderValue>;
</script>

<script lang="ts">
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-essentials';
	import type { IntervalObject } from '@kitschpatrol/tweakpane-plugin-essentials/dist/types/interval/model/interval.js';
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';

	type $$Props = {
		/**
		 * Interval value to control.
		 *
		 * Tuples are a convenience addition to the vanilla JS Tweakpane API.
		 * @bindable
		 */
		value: IntervalSliderValue;
		/**
		 * Midpoint of the interval range value.
		 * @bindable
		 * */
		meanValue?: number;
	} & Omit<ComponentProps<GenericSlider<IntervalSliderValue>>, 'options' | 'plugin' | 'ref'>;

	// Reexport for bindability
	export let value: $$Props['value'];
	export let meanValue: $$Props['meanValue'] = undefined;

	// Inheriting here with ComponentEvents makes a documentation mess
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 *
		 * @extends ValueChangeEvent
		 * @event
		 * */
		change: IntervalSliderChangeEvent;
	};

	// Proxy value since Tweakpane only supports Point3dObject type
	let internalValue: IntervalObject;

	function updateInternalValue() {
		if (Array.isArray(value)) {
			const [min, max] = value;
			internalValue = { min, max };
		} else {
			internalValue = value;
		}
	}

	function updateValue() {
		if (Array.isArray(value)) {
			const { min, max } = internalValue;
			value = [min, max];
		} else {
			value = internalValue;
		}
	}

	function updateValueFromMean() {
		if (meanValue !== undefined) {
			const r = internalValue.max - internalValue.min;
			internalValue = { min: meanValue - r / 2, max: meanValue + r / 2 };
		}
	}

	$: value, updateInternalValue();
	$: internalValue, updateValue();
	$: meanValue = (internalValue.min + internalValue.max) / 2;
	$: meanValue, updateValueFromMean();
</script>

<!--
@component  
A twin-handled slider control for specifying range values.

Integrates the [Interval](https://github.com/tweakpane/plugin-essentials#interval) control from
Tweakpane-creator [Hiroki Kokubun's](https://cocopon.me)  [Essentials
plugin](https://github.com/tweakpane/plugin-essentials).

_Svelte Tweakpane UI_ extends the original implementation to by supporting tuple values in addition
to object values. It also exposes a `meanValue` prop for reading or setting the midpoint of the
interval range value.

Usage outside of a `<Pane>` component will implicitly wrap the interval slider in `<Pane
position="inline">`.

Note that _Svelte Tweakpane UI_ embeds a functionally identical [fork](https://github.com/kitschpatrol/tweakpane-plugin-essentials) of the plugin with build optimizations. The fork also changes the package name from `@tweakpane/plugin-essentials` to `@kitschpatrol/tweakpane-plugin-essentials` for consistency with other plugins.

@emits {IntervalSliderChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import { IntervalSlider } from 'svelte-tweakpane-ui';

  // Could specify convenience type IntervalSliderValueTuple here, or
  // use the object {start: number, end: number} instead of a tuple
  let value: [number, number] = [25, 75];
</script>

<IntervalSlider
  bind:value
  min={0}
  max={100}
  format={(v) => `${v.toFixed(0)}%`}
/>
<div class="demo" style:--e="{value[1]}%" style:--s="{value[0]}%"></div>

<style>
  div.demo {
    aspect-ratio: 1;
    width: 100%;
    background: linear-gradient(45deg, magenta var(--s), orange var(--e));
  }
</style>
```

@sourceLink
[IntervalSlider.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/IntervalSlider.svelte)
-->

<GenericSlider bind:value={internalValue} on:change plugin={pluginModule} {...$$restProps} />
