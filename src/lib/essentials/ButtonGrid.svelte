<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import type { ButtonGridApi } from '@tweakpane/plugin-essentials';
	import { createEventDispatcher } from 'svelte';
	import { getGridDimensions } from '$lib/utils.js';
	import type { ButtonGridBladeParams } from '@tweakpane/plugin-essentials/dist/types/button-grid/plugin.d.ts';

	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let columns: number | undefined = undefined;
	export let rows: number | undefined = undefined;
	export let buttons: string[] = [];

	const dispatch = createEventDispatcher<{
		click: {
			index: number;
			label: string;
			cell: {
				x: number;
				y: number;
			};
		};
	}>();

	let bladeParams: ButtonGridBladeParams;
	let gridBlade: ButtonGridApi;

	function cells(
		x: number,
		y: number
	): {
		title: string;
	} {
		const index = y * gridDimensions.columns + x;

		if (index >= 0 && index < buttons.length) {
			return {
				title: `${buttons[index]}`
			};
		}
		return { title: '' };
	}

	$: gridDimensions = getGridDimensions(buttons.length, columns, rows);
	$: bladeParams = {
		view: 'buttongrid',
		label,
		size: [gridDimensions.columns, gridDimensions.rows],
		cells
	};
	$: gridBlade &&
		gridBlade.on('click', (ev) => {
			dispatch('click', {
				index: ev.index[1] * gridDimensions.columns + ev.index[0],
				label: ev.cell.title,
				cell: { x: ev.index[0], y: ev.index[1] }
			});
		});
</script>

<Blade {disabled} bind:bladeRef={gridBlade} {bladeParams} />
