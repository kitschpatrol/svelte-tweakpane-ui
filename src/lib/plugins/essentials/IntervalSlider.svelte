<script lang="ts" context="module">
	export type IntervalSliderValue =
		| {
				min: number;
				max: number;
		  }
		| [min: number, max: number];
</script>

<script lang="ts">
	import GenericSlider from '../../internal/GenericSlider.svelte';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import type { ComponentProps } from 'svelte';
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';
	import { BROWSER } from 'esm-env';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = Omit<
		ComponentProps<GenericSlider<IntervalSliderValue>>,
		'ref' | 'options' | 'plugin'
	> & {
		/**
		 * Interval value to control.
		 *
		 * Tuples are a convenience addition to vanilla Tweakpane's API.
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

	$: value, BROWSER && updateInternalValue();
	$: internalValue, BROWSER && updateValue();
	$: BROWSER && (meanValue = (internalValue.min + internalValue.max) / 2);
	$: meanValue, BROWSER && updateValueFromMean();
</script>

<!--
@component
TODO

@example
```tsx
TODO
```

@sourceLink
-->

{#if BROWSER}
	<GenericSlider bind:value={internalValue} plugin={pluginModule} {...$$restProps} />
{/if}
