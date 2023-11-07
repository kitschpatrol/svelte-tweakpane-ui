<script generics="T extends number | string | boolean | undefined" lang="ts">
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import GenericInput, { type GenericInputOptions } from '$lib/internal/GenericInput.svelte';
	import { getGridDimensions } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { nanoid } from 'nanoid';
	import type { ComponentProps } from 'svelte';

	// TODO handle records and more complex types? duplicated here because it's not exported from
	// the plugin... @tweakpane/plugin-essentials/dist/types/radio-grid/input-plugin.d.ts
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

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = Omit<
		ComponentProps<GenericInput<T, RadioGridOptions<T>>>,
		'options' | 'plugin' | 'ref'
	> & {
		/**
		 * Value of selected radio button.
		 *
		 * Bind to this prop to receive updates when the user clicks a radio button.
		 * @bindable
		 *  */
		value: T;
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
	export let value: $$Props['value'];
	export let values: $$Props['values'] = [value];
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

	$: BROWSER && (gridDimensions = getGridDimensions(values.length, columns, rows));
	$: BROWSER &&
		(options = {
			cells,
			groupName: groupName ?? defaultGroupName,
			size: [gridDimensions.columns, gridDimensions.rows],
			view: 'radiogrid'
		});
</script>

<!--
@component  
TODO Component documentation...

TK

Note about groupname

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
[RadioGrid.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/essentials/RadioGrid.svelte)
-->

{#if BROWSER}
	<GenericInput bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
