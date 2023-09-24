<script lang="ts" generics="U extends Point2dObject | Point3dObject | Point4dObject">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { Point2dInputParams, Point3dInputParams, Point4dInputParams } from 'tweakpane';
	import type { PickerLayout } from '@tweakpane/core';
	import type { Point2dObject } from '@tweakpane/core/dist/input-binding/point-2d/model/point-2d.js';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js';
	import type { Theme } from '$lib/theme.js';

	// TODO how to make certain props conditional on U
	// https://stackoverflow.com/questions/76553208/dynamic-props-for-svelte-component

	type PointParams<T> = T extends Point4dObject
		? Point4dInputParams
		: T extends Point3dObject
		? Point3dInputParams & { w: unknown }
		: T extends Point2dObject
		? Point2dInputParams & { z: unknown; w: unknown }
		: unknown;

	// re-exported
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let theme: Theme | undefined = undefined;

	//  unique
	export let value: U;
	export let expanded: boolean | undefined = undefined;
	export let format: ((value: number) => string) | undefined = undefined;
	export let keyScale: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let min: number | undefined = undefined;
	export let picker: PickerLayout | undefined = undefined;
	export let pointerScale: number | undefined = undefined;
	export let step: number | undefined = undefined;
	export let x: PointParams<U>['x'] = undefined;
	export let y: PointParams<U>['y'] = undefined;
	export let z: PointParams<U>['z'] = undefined;
	export let w: PointParams<U>['w'] = undefined;

	$: bindingParams = {
		pointerScale,
		keyScale,
		min,
		max,
		step,
		picker,
		x,
		y,
		z,
		w,
		expanded,
		format
	} as PointParams<U>; // Hmm
</script>

<GenericInput bind:value {label} {disabled} {bindingParams} {theme} />
