<script lang="ts" generics="T extends number | string | boolean">
	import Binding from '$lib/core/Binding.svelte';
	import { getGridDimensions, makeSafeKey } from '$lib/utils.js';
	import { onMount } from 'svelte';
	import type { BaseInputParams } from '@tweakpane/core';

	export let groupName: string = 'Group Name';
	export let label: string | undefined = undefined;
	export let value: T;
	export let values: T[] = [value];
	export let disabled: boolean = false;

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

	$: key = makeSafeKey(label);
	$: params = { [key]: getValue() };
	$: value = params[key];
	$: value, setValue();
	$: gridDimensions = getGridDimensions(values.length, columns, rows);
	$: bindingParams = {
		groupName,
		view: 'radiogrid',
		size: [gridDimensions.columns, gridDimensions.rows],
		cells
	};
</script>

<Binding {label} {disabled} bind:params {key} {bindingParams} />
