<script lang="ts" context="module">
	// TODO support tuple

	export type IntervalSliderValue =
		| {
				min: number;
				max: number;
		  }
		| [min: number, max: number];
</script>

<script lang="ts">
	import GenericSlider from '../../internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props
		extends Omit<
			ComponentProps<GenericSlider<IntervalSliderValue>>,
			'bindingRef' | 'bindingParams' | 'plugin'
		> {
		/** TODO Docs */
		value: IntervalSliderValue;
		/** Midpoint of the interval range value. Bindable. */
		meanValue: number;
	}

	export let value: $$Props['value'];
	export let meanValue: $$Props['meanValue'];

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
		const r = internalValue.max - internalValue.min;
		internalValue = { min: meanValue - r / 2, max: meanValue + r / 2 };
	}

	$: value, updateInternalValue();
	$: internalValue, updateValue();
	$: meanValue = (internalValue.min + internalValue.max) / 2;
	$: meanValue, updateValueFromMean();
</script>

<!--
@component
TODO

Example:
```tsx
TODO
```
-->

{#await import('@tweakpane/plugin-essentials') then module}
	<GenericSlider bind:value={internalValue} plugin={module} {...$$restProps} />
{/await}
