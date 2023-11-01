<script lang="ts" context="module">
	export type ButtonGridClickEvent = {
		index: number;
		label: string;
		cell: {
			x: number;
			y: number;
		};
	};
</script>

<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import { getGridDimensions } from '$lib/utils.js';
	import type { ButtonGridApi as ButtonGridRef } from '@tweakpane/plugin-essentials';
	import type { ButtonGridBladeParams as ButtonGridOptions } from '@tweakpane/plugin-essentials/dist/types/button-grid/plugin.d.ts';
	import { createEventDispatcher } from 'svelte';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	type $$Props = Omit<
		ComponentProps<Blade<ButtonGridOptions, ButtonGridRef>>,
		'ref' | 'options' | 'plugin'
	> & {
		/**
		 * Number of columns to arrange the buttons into.
		 *
		 * Setting `columns` without setting `rows` will lock the column count and allow the row count to change dynamically based on the number of buttons.
		 * @default dynamic based on quantity of `buttons`
		 * */
		columns?: number;
		/**
		 * Number of rows to arrange the buttons into.
		 *
		 * Setting `rows` without setting `columns` will lock the column count and allow the column count to change dynamically based on the number of buttons.
		 * @default dynamic based on quantity of `buttons`
		 * */
		rows?: number;
		/**
		 * Array of names, each of which will become the title of a button in the grid.
		 * */
		buttons: string[];
		/**
		 * Text displayed next to the button grid.
		 * @default `undefined`
		 */
		label?: string;
	};

	// unique
	export let columns: $$Props['columns'] = undefined;
	export let rows: $$Props['rows'] = undefined;
	export let buttons: $$Props['buttons'] = [];
	export let label: $$Props['label'] = undefined;

	// Seems to be the only way to get event comments to work
	type $$Events = {
		/**
		 * Fires when a button is clicked.
		 * @event
		 * */
		click: ButtonGridClickEvent;
	};

	const dispatch = createEventDispatcher<$$Events>();

	let options: ButtonGridOptions;
	let gridBlade: ButtonGridRef;
	let gridDimensions: { rows: number; columns: number };

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

	$: BROWSER && (gridDimensions = getGridDimensions(buttons.length, columns, rows));
	$: BROWSER &&
		(options = {
			view: 'buttongrid',
			label,
			size: [gridDimensions.columns, gridDimensions.rows],
			cells
		});
	$: BROWSER &&
		gridBlade &&
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

@emits {ButtonGridClickEvent} click - when a button in the grid is clicked

@example
```tsx
<script lang="ts">
  import { TODO } from 'svelte-tweakpane-ui';
  const status = 'TODO';
</script>

<pre>
{status}
</pre>
```

@sourceLink [ButtonGrid.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugins/essentials/ButtonGrid.svelte)
-->

{#if BROWSER}
	<Blade bind:ref={gridBlade} plugin={pluginModule} {options} {...$$restProps} />
{/if}
