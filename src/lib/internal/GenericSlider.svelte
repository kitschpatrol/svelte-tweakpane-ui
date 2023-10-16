<script lang="ts" generics="U extends number | IntervalObject">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { Theme } from '$lib/theme.js';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';
	import type { NumberInputParams } from 'tweakpane';

	// re-exported

	/** Text displayed next to control. */
	export let label: string | undefined = undefined;

	/** Prevent interactivity. Defaults to `false`. */
	export let disabled: boolean = false;

	/** Custom color scheme. Only applies if the slider is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;

	// unique

	export let value: U; // bindable

	/** Minimum value. Specifying both a `min` and a `max` prop turns the control into a slider. */
	export let min: number | undefined = undefined;

	/** Maximum value. Specifying both a `min` and a `max` prop turns the control into a slider. */
	export let max: number | undefined = undefined;

	/** The minimum step interval. */
	export let step: number | undefined = undefined;

	/** The unit scale for pointer-based input. */
	export let pointerScale: number | undefined = undefined;

	/** The unit scale for key-based input (e.g. up the up and down arrow keys). */
	export let keyScale: number | undefined = undefined;

	/** A function to customize the value's formatting (e.g. rounding, etc.). Note that this only changes the view / labels within the control, `value` will still return an unformatted number. */
	export let format: ((value: number) => string) | undefined = undefined;

	// deal with format firing a change
	// firing even when the function hasn't changed
	// probably related to https://github.com/sveltejs/svelte/issues/4265
	// possibly fixable with immutable=true but I don't want to go there
	// TODO evaluate other non-primitive prop access
	let formatProxy: typeof format = format;
	$: formatProxy !== format && (formatProxy = format);

	// the IntervalInputParams type is identical
	// to NumberInputParams, so don't bother with generics
	$: bindingParams = {
		min,
		max,
		step,
		pointerScale,
		keyScale,
		format: formatProxy
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

<GenericInput bind:value {label} {disabled} {bindingParams} {theme} />
