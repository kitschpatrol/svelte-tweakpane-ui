<script lang="ts" generics="T extends number | string | boolean">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import type { BaseInputParams } from '@tweakpane/core';

	export let groupName: string = 'Group Name';
	export let label: string | undefined = undefined;
	export let value: T;
	export let values: T[] = [value];
	export let disabled: boolean = false;

	// tries to be smart about rows and columns
	// if none are provided, it makes the most square grid possible
	// if one is provided, it lets the undefined axis grow / shrink
	// as needed
	// if both are provided, values may will be clipped
	export let columns: number | undefined = undefined;
	export let rows: number | undefined = undefined;
	export let suffix: string | undefined = undefined;
	export let prefix: string | undefined = undefined;

	// /@tweakpane/plugin-essentials/dist/types/radio-grid/input-plugin.d.ts
	// it's not exported...
	interface RadioGridInputParams<T> extends BaseInputParams {
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

	let bindingParams: RadioGridInputParams<T>;

	onMount(() => {});

	function getValue() {
		return value;
	}

	function setValue() {
		params[key] = value;
	}

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

	function getGridDimensions(
		itemCount: number,
		maxColumns?: number,
		maxRows?: number
	): { rows: number; columns: number } {
		let rows: number, columns: number;

		if (maxColumns && maxRows) {
			// No flexing; items can exceed the available slots
			rows = Math.min(Math.ceil(itemCount / maxColumns), maxRows);
			columns = Math.min(maxColumns, itemCount);
		} else if (maxColumns) {
			// Only maxColumns defined, so rows will flex
			rows = Math.ceil(itemCount / maxColumns);
			columns = maxColumns;
		} else if (maxRows) {
			// Only maxRows defined, so columns will flex
			columns = Math.ceil(itemCount / maxRows);
			rows = maxRows;
		} else {
			// Neither maxColumns nor maxRows defined; create a square grid
			columns = Math.ceil(Math.sqrt(itemCount));
			rows = Math.ceil(itemCount / columns);
		}

		return { rows, columns };
	}

	$: key = makeSafeKey(label);
	$: params = { [key]: getValue() };
	$: value = params[key];
	$: value, setValue();
	$: gridDimensions = getGridDimensions(values.length, columns, rows);
	$: bindingParams = {
		label,
		groupName,
		view: 'radiogrid',
		size: [gridDimensions.columns, gridDimensions.rows],
		cells
	};
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
