<script context="module" lang="ts">
	export type ButtonGridClickEvent = CustomEvent<{
		cell: {
			x: number;
			y: number;
		};
		index: number;
		label: string;
	}>;
</script>

<script lang="ts">
	import type { ButtonGridApi as ButtonGridRef } from '@tweakpane/plugin-essentials';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import type { ButtonGridBladeParams as ButtonGridOptions } from '@tweakpane/plugin-essentials/dist/types/button-grid/plugin.d.ts';
	import Blade from '$lib/core/Blade.svelte';
	import { type UnwrapCustomEvents, getGridDimensions } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { type ComponentProps, createEventDispatcher } from 'svelte';

	type $$Props = Omit<
		ComponentProps<Blade<ButtonGridOptions, ButtonGridRef>>,
		'options' | 'plugin' | 'ref'
	> & {
		/**
		 * Array of names, each of which will become the title of a button in the grid.
		 * */
		buttons: string[];
		/**
		 * Number of columns to arrange the buttons into.
		 *
		 * Setting `columns` without setting `rows` will lock the column count and allow the row count to change dynamically based on the number of buttons.
		 * @default dynamic based on quantity of `buttons`
		 * */
		columns?: number;
		/**
		 * Text displayed next to the button grid.
		 * @default `undefined`
		 */
		label?: string;
		/**
		 * Number of rows to arrange the buttons into.
		 *
		 * Setting `rows` without setting `columns` will lock the column count and allow the column count to change dynamically based on the number of buttons.
		 * @default dynamic based on quantity of `buttons`
		 * */
		rows?: number;
	};

	// unique
	export let columns: $$Props['columns'] = undefined;
	export let rows: $$Props['rows'] = undefined;
	export let buttons: $$Props['buttons'] = [];
	export let label: $$Props['label'] = undefined;

	// Seems to be the only way to get event comments to work
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Events = {
		/**
		 * Fires when a button is clicked.
		 *
		 * Note that the values described in the `ButtonGridClickEvent`
		 * type are available on the `event.detail` parameter.
		 * @event
		 * */
		click: ButtonGridClickEvent;
	};

	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>();

	let options: ButtonGridOptions;
	let gridBlade: ButtonGridRef;
	let gridDimensions: { columns: number; rows: number };

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
			cells,
			label,
			size: [gridDimensions.columns, gridDimensions.rows],
			view: 'buttongrid'
		});
	$: BROWSER &&
		gridBlade &&
		gridBlade.on('click', (ev) => {
			dispatch('click', {
				cell: { x: ev.index[0], y: ev.index[1] },
				index: ev.index[1] * gridDimensions.columns + ev.index[0],
				label: ev.cell.title
			});
		});
</script>

<!--
@component
TODO

@emits {ButtonGridClickEvent} click - when a button in the grid is clicked

@example
```svelte
<script lang="ts">
  import {
    Button,
    ButtonGrid,
    type ButtonGridClickEvent,
    Pane
  } from 'svelte-tweakpane-ui';

  const keyboard = [
    ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)),
    ',',
    '.',
    '!',
    '⌫'
  ];

  let textBuffer = '';

  function handleClick(e: ButtonGridClickEvent) {
    textBuffer =
      e.detail.label === '⌫'
        ? textBuffer.slice(0, -1)
        : textBuffer + e.detail.label;
  }
</script>

<Pane position="inline" title="Austerity Keyboard">
  <ButtonGrid buttons={keyboard} on:click={handleClick} />
  <Button on:click={() => (textBuffer += '\u2002')} title=" " />
</Pane>
<div class="demo">
  <p>{textBuffer}</p>
</div>

<style>
  .demo {
    aspect-ratio: 1;
    width: 100%;
    background: linear-gradient(45deg, orange, magenta);
  }

  .demo > p {
    margin: 0;
    padding: 0.5em;
    font-family: monospace;
    font-size: 8cqw;
    line-height: 1.2;
    color: white;
    word-break: break-all;
    white-space: pre-wrap;
  }

  .demo > p::after {
    content: '_';
    opacity: 0.5;
  }
</style>
```

@sourceLink [ButtonGrid.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/essentials/ButtonGrid.svelte)
-->

{#if BROWSER}
	<Blade bind:ref={gridBlade} {options} plugin={pluginModule} {...$$restProps} />
{/if}
