<script lang="ts">
	import Blade from '../../core/Blade.svelte';
	import { getGridDimensions } from '../../utils.js';
	import type { ButtonGridApi } from '@tweakpane/plugin-essentials';
	import type { ButtonGridBladeParams } from '@tweakpane/plugin-essentials/dist/types/button-grid/plugin.d.ts';
	import { createEventDispatcher } from 'svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<
			ComponentProps<Blade<ButtonGridBladeParams, ButtonGridApi>>,
			'bladeRef' | 'bladeParams' | 'plugin'
		> {
		/** TODO Docs */
		columns?: number;
		/** TODO Docs */
		rows?: number;
		/** TODO Docs */
		buttons: string[];
		/** TODO Docs */
		label?: string;
	}

	// unique
	export let columns: $$Props['columns'] = undefined;
	export let rows: $$Props['rows'] = undefined;
	export let buttons: $$Props['buttons'] = [];
	export let label: $$Props['label'] = undefined;

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

<!--
@component
TODO

Example:
```tsx
TODO
```
-->

{#await import('@tweakpane/plugin-essentials') then module}
	<Blade bind:bladeRef={gridBlade} plugin={module} {bladeParams} {...$$restProps} />
{/await}
