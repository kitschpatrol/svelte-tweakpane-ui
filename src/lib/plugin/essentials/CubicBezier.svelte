<script lang="ts">
	import GenericBladeFolding from '$lib/internal/GenericBladeFolding.svelte';
	import type { Theme } from '$lib/theme.js';
	import type { PickerLayout } from '@tweakpane/core';
	import type { CubicBezierApi } from '@tweakpane/plugin-essentials';
	import { CubicBezier } from '@tweakpane/plugin-essentials';
	import type { CubicBezierBladeParams } from '@tweakpane/plugin-essentials/dist/types/cubic-bezier/plugin.d.ts';

	// re-exported
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;
	export let clickToExpand: boolean = true;
	export let expanded: boolean | undefined = undefined;
	export let picker: PickerLayout | undefined = undefined;

	// unique
	export let label: string | undefined = undefined;
	export let value: [number, number, number, number];

	let bladeParams: CubicBezierBladeParams;
	let cubicBezierBlade: CubicBezierApi;

	// work-arounds for funky folding
	const buttonClass = 'tp-cbzv_b';

	function getValue() {
		return value;
	}

	function setValue() {
		cubicBezierBlade.value = new CubicBezier(value[0], value[1], value[2], value[3]);
	}

	function addEvent() {
		cubicBezierBlade.on('change', (ev) => {
			value = [ev.value.x1, ev.value.y1, ev.value.x2, ev.value.y2];
		});
	}

	$: bladeParams = {
		view: 'cubicbezier',
		label,
		value: getValue()
	};
	$: cubicBezierBlade && addEvent();
	$: value, cubicBezierBlade && setValue();
</script>

<GenericBladeFolding
	bind:expanded
	{buttonClass}
	{clickToExpand}
	{disabled}
	{picker}
	bind:bladeRef={cubicBezierBlade}
	{bladeParams}
	{theme}
/>
