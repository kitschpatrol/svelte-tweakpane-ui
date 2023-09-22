<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import type { CubicBezierApi } from '@tweakpane/plugin-essentials';
	import { CubicBezier } from '@tweakpane/plugin-essentials';
	import type { CubicBezierBladeParams } from '@tweakpane/plugin-essentials/dist/types/cubic-bezier/plugin.d.ts';
	import type { PickerLayout } from '@tweakpane/core';

	// re-exported
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;

	// unique
	export let expanded: boolean | undefined = undefined;
	export let value: [number, number, number, number];
	export let picker: PickerLayout | undefined = undefined;

	let bladeParams: CubicBezierBladeParams;
	let cubicBezierBlade: CubicBezierApi;

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
		picker,
		value: getValue(),
		expanded
	};
	$: cubicBezierBlade && addEvent();
	$: value, cubicBezierBlade && setValue();
</script>

<Blade {disabled} bind:bladeRef={cubicBezierBlade} {bladeParams} />
