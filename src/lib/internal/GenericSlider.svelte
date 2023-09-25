<script lang="ts" generics="U extends number | IntervalObject">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { Theme } from '$lib/theme.js';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';
	import type { NumberInputParams } from 'tweakpane';

	// Note that we go from a regular slider to a rang / interval slider
	// (via the essentials plugin) just by changing the input type
	// For the sake of consistency and discoverability, Interval
	// is implement as a separate componetn leveraging this generic

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;

	// unique
	export let value: U; // bindable
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let step: number | undefined = undefined;
	export let pointerScale: number | undefined = undefined;
	export let keyScale: number | undefined = undefined;
	export let format: ((value: number) => string) | undefined = undefined;

	// the IntervalInputParams type is identical
	// to NumberInputParams, so don't bother with generics
	$: bindingParams = {
		min,
		max,
		step,
		pointerScale,
		keyScale,
		format
	} satisfies NumberInputParams;
</script>

<GenericInput bind:value {label} {disabled} {bindingParams} {theme} />
