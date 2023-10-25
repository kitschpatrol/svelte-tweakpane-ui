<script lang="ts" generics="T extends number | string | boolean | undefined">
	import GenericInput, { type GenericInputOptions } from '../../internal/GenericInput.svelte';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import { getGridDimensions } from '../../utils.js';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';
	import { nanoid } from 'nanoid';

	// duplicated here because it's not exported from the plugin...
	// @tweakpane/plugin-essentials/dist/types/radio-grid/input-plugin.d.ts
	type RadioGridOptions<T> = GenericInputOptions & {
		cells: (
			x: number,
			y: number
		) => {
			title: string;
			value: T;
		};
		groupName: string;
		size: [number, number];
		view: 'radiogrid';
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = Omit<
		ComponentProps<GenericInput<T, RadioGridOptions<T>>>,
		'ref' | 'options' | 'plugin'
	> & {
		/**
		 * Name allowing multiple radio groups to share mutually exclusive selection state.
		 *
		 * Allows spanning exclusive selection state across multiple independent `<RadioGrid>` components, but should remain `undefined` for most use cases to keep exclusivitiy scoped to a single `<RadioGrid>`.
		 * @default `undefined` (Which uses a dynamically generated globally unique id internally.)
		 */
		groupName?: string;
		/**
		 * Value of selected radio button.
		 *
		 * Bind to this prop to receive updates when the user clicks a radio button.
		 * @bindable
		 *  */
		value: T;
		/**
		 * Array of `number`, `string` or `boolean` values, each of which will become a button in the radio grid.
		 * */
		values: T[];
		/**
		 * Number of columns to arrange the radio buttons into.
		 * @default `undefined`
		 * */
		columns?: number;
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
		 * Text to show in the radio button label before the value.
		 * @default `undefined`
		 * */
		prefix?: string;
	};

	// ensure no entangled selection across multiple RadioGrids,
	// unless the user explicitly asks for it
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
		title: string;
		value: T;
	} {
		const index = y * gridDimensions.columns + x;

		if (index >= 0 && index < values.length) {
			return {
				title: `${prefix ?? ''}${values[index]}${suffix ?? ''}`,
				value: values[index]
			};
		}
		return { title: '', value: values[0] };
	}

	$: BROWSER && (gridDimensions = getGridDimensions(values.length, columns, rows));
	$: BROWSER &&
		(options = {
			groupName: groupName ?? defaultGroupName,
			view: 'radiogrid',
			size: [gridDimensions.columns, gridDimensions.rows],
			cells
		});
</script>

<!--
@component
TODO

Note about groupname

@example
```tsx
TODO
```

@sourceLink
-->

{#if BROWSER}
	<GenericInput bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
