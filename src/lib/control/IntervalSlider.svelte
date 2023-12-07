<script context="module" lang="ts">
	import type { Simplify } from '$lib/utils';

	export type IntervalSliderValueTuple = [min: number, max: number];
	export type IntervalSliderValueObject = {
		min: number;
		max: number;
	};
	export type IntervalSliderValue = Simplify<IntervalSliderValueObject | IntervalSliderValueTuple>;
</script>

<script lang="ts">
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = Omit<
		ComponentProps<GenericSlider<IntervalSliderValue>>,
		'options' | 'plugin' | 'ref'
	> & {
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
	};

	// reexport for bindability
	export let value: $$Props['value'];
	export let meanValue: $$Props['meanValue'] = undefined;

	// proxy value since Tweakpane only supports Point3dObject type
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
position='inline'>`.

@example  
```svelte
<script lang="ts">
import { IntervalSlider } from 'svelte-tweakpane-ui';

// Could specify convenience type IntervalSliderValueTuple here, or
// use the object {start: number, end: number} instead of a tuple
let value: [number, number] = [25, 75];
</script>

<IntervalSlider
  bind:value={value}
  min={0}
  max={100}
  format={(v) => `${v.toFixed(0)}%`}
/>
<div class="demo" style:--e="{value[1]}%" style:--s="{value[0]}%" />

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

<GenericSlider bind:value={internalValue} plugin={pluginModule} {...$$restProps} />
