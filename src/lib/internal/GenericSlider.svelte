<script lang="ts" generics="T extends number | IntervalSliderValue">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { IntervalSliderValue } from '../plugins/essentials/IntervalSlider.svelte';

	import GenericInput from './GenericInput.svelte';
	import type { NumberInputParams as GenericSliderOptions } from 'tweakpane';
	import type { SliderInputBindingApi as GenericSliderRef } from 'tweakpane';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	type $$Props = ComponentProps<GenericInput<T, GenericSliderOptions, GenericSliderRef>> & {
		/**
		 * Minimum value.
		 *
		 * Specifying both a `min` and a `max` prop turns the control into a slider.
		 * @default `undefined`
		 * */
		min?: number;
		/**
		 * Maximum value.
		 *
		 * Specifying both a `min` and a `max` prop turns the control into a slider.
		 * @default `undefined`
		 * */
		max?: number;
		/**
		 * The minimum step interval.
		 * @default `undefined` (no step constraint)
		 * */
		step?: number;
		/**
		 * The unit scale for pointer-based input for all dimensions.
		 * @default [dynamic based on magnitude of `value`](https://github.com/cocopon/tweakpane/blob/66dfbea04bfe9b7f031673c955ceda1f92356e75/packages/core/src/common/number/util.ts#L54)
		 * */
		pointerScale?: number;
		/**
		 * The unit scale for key-based input for all dimensions (e.g. the up and down arrow keys).
		 * @default `1` or `stepValue` if defined
		 * */
		keyScale?: number;
		/**
		 * A function to customize the point value's formatting (e.g. rounding, etc.).
		 * @default `undefined` (normal `.toString()` formatting)
		 * */
		format?: (value: number) => string;
	};

	// redeclare for bindability
	export let value: $$Props['value'];
	export let options: $$Props['options'] = undefined;
	export let min: $$Props['min'] = undefined;
	export let max: $$Props['max'] = undefined;
	export let step: $$Props['step'] = undefined;
	export let pointerScale: $$Props['pointerScale'] = undefined;
	export let keyScale: $$Props['keyScale'] = undefined;
	export let format: $$Props['format'] = undefined;

	// deal with format firing a change
	// firing even when the function hasn't changed
	// probably related to https://github.com/sveltejs/svelte/issues/4265
	// possibly fixable with immutable=true but I don't want to go there
	let formatProxy: typeof format = format;
	$: BROWSER && formatProxy !== format && (formatProxy = format);

	let optionsInternal: GenericSliderOptions;

	// the IntervalInputParams type is identical
	// to NumberInputParams, so don't bother with generics
	$: BROWSER &&
		(optionsInternal = {
			min,
			max,
			step,
			pointerScale,
			keyScale,
			format: formatProxy,
			...options
		});
</script>

<!--
@component
This component is for internal use only.

Note that we go from a regular slider to a range / interval slider
(via the essentials plugin) just by changing the input type
For the sake of consistency and discoverability, `<IntervalSlider>`
is implement as a separate component leveraging this generic
implementation.

@sourceLink
-->

{#if BROWSER}
	<GenericInput bind:value options={optionsInternal} {...$$restProps} />
{/if}
