<script lang="ts" generics="T extends number | string | boolean | undefined">
	import GenericInput, { type GenericInputOptions } from '../../internal/GenericInput.svelte';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import { getGridDimensions } from '../../utils.js';
	import type { ComponentProps } from 'svelte';

	// /@tweakpane/plugin-essentials/dist/types/radio-grid/input-plugin.d.ts
	// it's not exported...
	interface RadioGridInputParams<T> extends GenericInputOptions {
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
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props
		extends Omit<
			ComponentProps<GenericInput<T, RadioGridInputParams<T>>>,
			'ref' | 'options' | 'plugin'
		> {
		/** TODO Docs */
		groupName?: string;
		/** TODO Docs */
		value: T;
		/** TODO Docs */
		values: T[];
		/** TODO Docs */
		columns?: number;
		/** TODO Docs */
		rows?: number;
		/** TODO Docs */
		suffix?: string;
		/** TODO Docs */
		prefix?: string;
	}

	const defaultGroupName = 'Group Name';

	// unique
	export let groupName: $$Props['groupName'] = defaultGroupName;
	export let value: $$Props['value'];
	export let values: $$Props['values'] = [value];
	export let columns: $$Props['columns'] = undefined;
	export let rows: $$Props['rows'] = undefined;
	export let suffix: $$Props['suffix'] = undefined;
	export let prefix: $$Props['prefix'] = undefined;

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

	$: gridDimensions = getGridDimensions(values.length, columns, rows);
	$: options = {
		groupName: groupName ?? defaultGroupName,
		view: 'radiogrid',
		size: [gridDimensions.columns, gridDimensions.rows],
		cells
	} as RadioGridInputParams<T>;
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

<GenericInput bind:value {options} plugin={pluginModule} {...$$restProps} />
