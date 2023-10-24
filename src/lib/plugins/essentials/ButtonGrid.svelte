<script lang="ts">
	import Blade from '../../core/Blade.svelte';
	import { getGridDimensions } from '../../utils.js';
	import type { ButtonGridApi as ButtonGridRef } from '@tweakpane/plugin-essentials';
	import type { ButtonGridBladeParams as ButtonGridOptions } from '@tweakpane/plugin-essentials/dist/types/button-grid/plugin.d.ts';
	import { createEventDispatcher } from 'svelte';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<
			ComponentProps<Blade<ButtonGridOptions, ButtonGridRef>>,
			'ref' | 'options' | 'plugin'
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

	// Seems to be the only way to get event comments to work
	interface $$Events {
		/** Fires when a button is clicked.
		 * @event
		 */
		click: {
			index: number;
			label: string;
			cell: {
				x: number;
				y: number;
			};
		};
	}

	const dispatch = createEventDispatcher<$$Events>();

	let options: ButtonGridOptions;
	let gridBlade: ButtonGridRef;

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
	$: options = {
		view: 'buttongrid',
		label,
		size: [gridDimensions.columns, gridDimensions.rows],
		cells
	} as ButtonGridOptions;
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

@sourceLink
-->

<Blade bind:ref={gridBlade} plugin={pluginModule} {options} {...$$restProps} />
