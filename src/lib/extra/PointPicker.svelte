<script lang="ts">
	import Binding from '$lib/core/Binding.svelte';
	import { makeSafeKey } from '$lib/utils.js';
	import type { Point2dInputParams, Point3dInputParams, Point4dInputParams } from 'tweakpane';
	import type { PickerLayout } from '@tweakpane/core';

	import type { Point2dObject } from '@tweakpane/core/dist/input-binding/point-2d/model/point-2d.js';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js';

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
	export let value: Point2dObject | Point3dObject | Point4dObject;

	// flat, but kinda silly, could pass as objects...
	export let xFormat: ((value: number) => string) | undefined = undefined;
	export let xKeyScale: number | undefined = undefined;
	export let xMax: number | undefined = undefined;
	export let xMin: number | undefined = undefined;
	export let xPointerScale: number | undefined = undefined;
	export let xStep: number | undefined = undefined;
	export let yFormat: ((value: number) => string) | undefined = undefined;
	export let yKeyScale: number | undefined = undefined;
	export let yMax: number | undefined = undefined;
	export let yMin: number | undefined = undefined;
	export let yPointerScale: number | undefined = undefined;
	export let yStep: number | undefined = undefined;
	export let yInverted: boolean | undefined = undefined; // only applies to 2D....
	export let zFormat: ((value: number) => string) | undefined = undefined;
	export let zKeyScale: number | undefined = undefined;
	export let zMax: number | undefined = undefined;
	export let zMin: number | undefined = undefined;
	export let zPointerScale: number | undefined = undefined;
	export let zStep: number | undefined = undefined;
	export let wFormat: ((value: number) => string) | undefined = undefined;
	export let wKeyScale: number | undefined = undefined;
	export let wMax: number | undefined = undefined;
	export let wMin: number | undefined = undefined;
	export let wPointerScale: number | undefined = undefined;
	export let wStep: number | undefined = undefined;

	// avoid circular
	function getValue() {
		return value;
	}

	function setValue() {
		params[key] = value;
	}

	$: key = makeSafeKey(label);
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
		expanded,
		format,
		xFormat,
		xKeyScale,
		xMax,
		xMin,
		xPointerScale,
		xStep,
		yFormat,
		yKeyScale,
		yMax,
		yMin,
		yPointerScale,
		yStep,
		yInverted,
		zFormat,
		zKeyScale,
		zMax,
		zMin,
		zPointerScale,
		zStep,
		wFormat,
		wKeyScale,
		wMax,
		wMin,
		wPointerScale,
		wStep
	}; // todo, type?
</script>

<Binding {disabled} bind:params {key} {bindingParams} />
