<script lang="ts" generics="T extends number | IntervalObject">
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';

	import GenericInput from './GenericInput.svelte';
	import type { NumberInputParams } from 'tweakpane';
	import type { ComponentProps } from 'svelte';

	interface $$Props extends ComponentProps<GenericInput<T>> {
		/** Minimum value. Specifying both a `min` and a `max` prop turns the control into a slider. */
		min?: number;
		/** Maximum value. Specifying both a `min` and a `max` prop turns the control into a slider. */
		max?: number;
		/** The minimum step interval. */
		step?: number;
		/** The unit scale for pointer-based input. */
		pointerScale?: number;
		/** The unit scale for key-based input (e.g. up the up and down arrow keys). */
		keyScale?: number;
		/** A function to customize the value's formatting (e.g. rounding, etc.). Note that this only changes the view / labels within the control, `value` will still return an unformatted number. */
		format?: (value: number) => string;
	}

	// must redeclare for bindability
	export let value: $$Props['value'];
	export let bindingParams: $$Props['bindingParams'] = undefined;

	// unique props

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
	// TODO evaluate other non-primitive prop access
	let formatProxy: typeof format = format;
	$: formatProxy !== format && (formatProxy = format);

	// the IntervalInputParams type is identical
	// to NumberInputParams, so don't bother with generics
	$: bindingParamsInternal = {
		min,
		max,
		step,
		pointerScale,
		keyScale,
		format: formatProxy,
		...bindingParams
	} satisfies NumberInputParams;
</script>

<!--
@component
This component is for internal use only.

Note that we go from a regular slider to a range / interval slider
(via the essentials plugin) just by changing the input type
For the sake of consistency and discoverability, `<Interval>`
is implement as a separate component leveraging this generic
implementation.
-->

<GenericInput bind:value bindingParams={bindingParamsInternal} {...$$restProps} />
