<script lang="ts" generics="U extends Point2dObject | Point3dObject | Point4dObject">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { Point2dInputParams, Point3dInputParams, Point4dInputParams } from 'tweakpane';
	import type { PickerLayout } from '@tweakpane/core';

	import type { Point2dObject } from '@tweakpane/core/dist/input-binding/point-2d/model/point-2d.js';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js';

	type PointParams<T> = T extends Point4dObject
		? Point4dInputParams
		: T extends Point3dObject
		? Point3dInputParams & { w: unknown }
		: T extends Point2dObject
		? Point2dInputParams & { z: unknown; w: unknown }
		: unknown;

	export let value: U;
	export let disabled: boolean = false;
	export let expanded: boolean = false;
	export let format: ((value: number) => string) | undefined = undefined;
	export let keyScale: number | undefined = undefined;
	export let label: string = 'Point Picker';
	export let max: number | undefined = undefined;
	export let min: number | undefined = undefined;
	export let picker: PickerLayout = 'popup';
	export let pointerScale: number | undefined = undefined;
	export let step: number | undefined = undefined;

	export let x: PointParams<U>['x'] = undefined;
	export let y: PointParams<U>['y'] = undefined;
	export let z: PointParams<U>['z'] = undefined;
	export let w: PointParams<U>['w'] = undefined;

	let bindingParams: PointParams<U>;
	// why does this obviate the as cast...
	// let bindingParams: Point2dInputParams | Point3dInputParams | Point4dInputParams;

	function getValue() {
		return value;
	}

	function setValue() {
		params[key] = value;
	}

	$: key = label ? makeSafeKey(label) : 'key';
	$: params = { [key]: getValue() };
	$: value = params[key];
	$: value, setValue();
	$: bindingParams = {
		label,
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

<Binding {disabled} bind:params {key} {bindingParams} />
