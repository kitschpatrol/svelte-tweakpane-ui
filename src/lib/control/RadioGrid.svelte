<script generics="T extends number | string | boolean" lang="ts">
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import GenericInput, { type GenericInputOptions } from '$lib/internal/GenericInput.svelte';
	import { fillWith } from '$lib/utils';
	import { getGridDimensions } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { nanoid } from 'nanoid';
	import type { ComponentProps } from 'svelte';

	// TODO allow mixed values? TODO handle records and more complex types? duplicated here because
	// it's not exported from the plugin...
	// @tweakpane/plugin-essentials/dist/types/radio-grid/input-plugin.d.ts
	type RadioGridOptions<T> = GenericInputOptions & {
		cells: (
			x: number,
			y: number
		) => {
			value: T;
			title: string;
		};
		groupName: string;
		size: [number, number];
		view: 'radiogrid';
	};

	type $$Props = Omit<
		ComponentProps<GenericInput<T, RadioGridOptions<T>>>,
		'options' | 'plugin' | 'ref'
	> & {
		/**
		 * Value of selected radio button.
		 *
		 * Bind to this prop to receive updates when the user clicks a radio button.
		 * @bindable
		 * @default `undefined` If undefined, the first value in the `values` array is assigned.
		 *  */
		value?: T;
		/**
		 * Number of columns to arrange the radio buttons into.
		 * @default `undefined`
		 * */
		columns?: number;
		/**
		 * Name allowing multiple radio groups to share mutually exclusive selection state.
		 *
		 * Allows spanning exclusive selection state across multiple independent `<RadioGrid>`
		 * components, but should remain `undefined` for most use cases to keep exclusivity scoped
		 * to a single `<RadioGrid>`.
		 * @default `undefined`  \
		 * Uses a dynamically generated globally unique id internally.
		 */
		groupName?: string;
		/**
		 * Text to show in the radio button label before the value.
		 * @default `undefined`
		 * */
		prefix?: string;
		/**
		 * Number of rows to arrange the radio buttons into.
		 * @default `undefined`
		 * */
		rows?: number;
		/**
		 * Text to show in the radio button label after the value.
		 * @default `undefined`
		 * */
		suffix?: string;
		/**
		 * Array of `number`, `string` or `boolean` values, each of which will become a button in
		 * the radio grid.
		 * */
		values: T[];
	};

	// ensure no entangled selection across multiple RadioGrids, unless the user explicitly asks for
	// it
	const defaultGroupName = nanoid();

	// reexport for bindability
	export let groupName: $$Props['groupName'] = undefined;
	export let values: $$Props['values'];
	export let value: $$Props['value'] = values[0];
	export let columns: $$Props['columns'] = undefined;
	export let rows: $$Props['rows'] = undefined;
	export let suffix: $$Props['suffix'] = undefined;
	export let prefix: $$Props['prefix'] = undefined;

	let gridDimensions: { columns: number; rows: number };
	let options: RadioGridOptions<T>;

	function cells(
		x: number,
		y: number
	): {
		value: T;
		title: string;
	} {
		const index = y * gridDimensions.columns + x;

		if (index >= 0 && index < values.length) {
			return {
				value: values[index],
				title: `${prefix ?? ''}${values[index]}${suffix ?? ''}`
			};
		}
		return { value: values[0], title: '' };
	}

	$: gridDimensions = getGridDimensions(values.length, columns, rows);
	$: options = {
		cells,
		groupName: groupName ?? defaultGroupName,
		size: [gridDimensions.columns, gridDimensions.rows],
		view: 'radiogrid'
	};
</script>

<!--
@component  

A grid of radio buttons.

Integrates the [Radio Grid](https://github.com/tweakpane/plugin-essentials#radio-grid) control from
Tweakpane-creator [Hiroki Kokubun's](https://cocopon.me)  [Essentials
plugin](https://github.com/tweakpane/plugin-essentials).

See `<ButtonGrid>` for a button-flavored variation.

Unlike the vanilla Tweakpane API, _Svelte Tweakpane UI_ provides a unique `groupname` for each
instance of RadioGrid by default for consistency with expectations around component isolation. You
may still assign the `groupname` prop manually to create cross-component groups that share selection
exclusivity.

_Svelte Tweakpane UI_ also includes some additional logic to manage default grid dimensions:

    - If no `rows` or `columns` props are provided, it will create a grid with the squarest possible aspect ratio for the given quantity of `values`.

    - If a single `rows` or `columns` prop is provided, it lets the undefined axis grow / shrink as needed to accommodate the quantity of `values`.

    - If both `rows` _and_ `columns` props area provided, then buttons may be clipped if `rows * columns < values.length`.


Usage outside of a `<Pane>` component will implicitly wrap the radio grid in `<Pane
position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { RadioGrid } from 'svelte-tweakpane-ui';

  // Svelte transition works around CSS gradient
  // transition limitations
  import { fade } from 'svelte/transition';

  const radioValues = [
    ['magenta', 'orange'],
    ['yellow', 'red'],
    ['violet', 'gold'],
    ['red', 'rebeccapurple']
  ];

  let value = 1;

  $: [start, end] = radioValues[value - 1];
</script>

<RadioGrid bind:value prefix="Color Scheme " values={[1, 2, 3, 4]} />

<div class="demo">
  {#key value}
    <div class="swatch" style:--e={end} style:--s={start} transition:fade></div>
  {/key}
</div>

<style>
  div.demo {
    position: relative;
    aspect-ratio: 1;
    width: 100%;
    background: white;
  }

  div.swatch {
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, var(--s), var(--e));
  }
</style>
```

@sourceLink
[RadioGrid.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/RadioGrid.svelte)
-->

<GenericInput bind:value {options} plugin={pluginModule} {...$$restProps} />
{#if !BROWSER}
	<ClsPad keysAdd={fillWith('containerUnitSize', gridDimensions.rows - 1)} theme={$$props.theme} />
	<div style:height={`${2 * (gridDimensions.rows - 1)}px`} />
{/if}
