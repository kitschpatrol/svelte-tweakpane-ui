<script lang="ts" generics="T extends number | string | boolean">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import { getGridDimensions } from '$lib/utils.js';

	// /@tweakpane/plugin-essentials/dist/types/radio-grid/input-plugin.d.ts
	// it's not exported...
	interface RadioGridInputParams<T> {
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

	// re-exported
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;

	// unique
	export let groupName: string = 'Group Name';
	export let value: T;
	export let values: T[] = [value];
	export let columns: number | undefined = undefined;
	export let rows: number | undefined = undefined;
	export let suffix: string | undefined = undefined;
	export let prefix: string | undefined = undefined;

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
	$: bindingParams = {
		groupName,
		view: 'radiogrid',
		size: [gridDimensions.columns, gridDimensions.rows],
		cells
	} satisfies RadioGridInputParams<T>;
</script>

<GenericInput bind:value {label} {disabled} {bindingParams} />
