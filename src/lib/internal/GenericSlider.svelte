<script generics="T extends number | IntervalSliderValue" lang="ts">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { IntervalSliderValue } from '$lib/control/IntervalSlider.svelte';
	import type { ComponentProps } from 'svelte';
	import type { NumberInputParams as GenericSliderOptions } from 'tweakpane';
	import type { SliderInputBindingApi as GenericSliderRef } from 'tweakpane';
	import GenericInput from '$lib/internal/GenericInput.svelte';

	type $$Props = {
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
		 * A function to customize the point value's string representation (e.g. rounding, etc.).
		 * @default `undefined`  \
		 * Normal `.toString()` formatting.
		 * */
		format?: (value: number) => string;
		/**
		 * The unit scale for key-based input for all dimensions (e.g. the up and down arrow keys).
		 * @default `1`  \
		 * Or `stepValue` if defined.
		 * */
		keyScale?: number;
		/**
		 * The unit scale for pointer-based input for all dimensions.
		 * @default `undefined`  \
		 * [Dynamic based on magnitude of
		 * `value`](https://github.com/cocopon/tweakpane/blob/66dfbea04bfe9b7f031673c955ceda1f92356e75/packages/core/src/common/number/util.ts#L54).
		 * */
		pointerScale?: number;
		/**
		 * The minimum step interval.
		 * @default `undefined`  \
		 * No step constraint.
		 * */
		step?: number;
		/**
		 * When `true`, expand the width of the control at the expense of the numeric input
		 * field.
		 * @default `false`
		 * */
		wide?: boolean;
	} & ComponentProps<GenericInput<T, GenericSliderOptions, GenericSliderRef>>;

	// Redeclare for bindability
	export let value: $$Props['value'];
	export let options: $$Props['options'] = undefined;
	export let min: $$Props['min'] = undefined;
	export let max: $$Props['max'] = undefined;
	export let step: $$Props['step'] = undefined;
	export let pointerScale: $$Props['pointerScale'] = undefined;
	export let keyScale: $$Props['keyScale'] = undefined;
	export let format: $$Props['format'] = undefined;
	export let ref: $$Props['ref'] = undefined;

	// Wide is "patched in" to address issue #8. Wheel and Ring, which extend
	// GenericSlider, already have an implementation for a wide prop, so they
	// share this interface. Doesn't actually need to be exported because
	// it's only used by components that inherit from GenericSlider.
	// export let wide: $$Props['wide'] = undefined;

	// Deal with format firing a change firing even when the function hasn't changed probably
	// related to https://github.com/sveltejs/svelte/issues/4265 possibly fixable with
	// immutable=true but I don't want to go there
	let formatProxy: typeof format = format;
	$: formatProxy !== format && (formatProxy = format);

	let optionsInternal: GenericSliderOptions | undefined;

	// The IntervalInputParams type is identical to NumberInputParams, so don't bother with generics
	$: optionsInternal = {
		min,
		max,
		format: formatProxy,
		keyScale,
		pointerScale,
		step,
		...options
	};
</script>

<!--
@component  
This component is for internal use only.

Note that we go from a regular slider to a range / interval slider (via the essentials plugin) just
by changing the input type For the sake of consistency and discoverability, `<IntervalSlider>` is
implement as a separate component leveraging this generic implementation.

@sourceLink
[GenericSlider.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericSlider.svelte)
-->

<GenericInput bind:value bind:ref on:change options={optionsInternal} {...$$restProps} />
