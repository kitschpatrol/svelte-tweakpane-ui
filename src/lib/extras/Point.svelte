<script lang="ts" context="module">
	// extends Tweakpane's implementation to support tuples
	import type { Point2dInputParams, Point3dInputParams, Point4dInputParams } from 'tweakpane';
	type PointOptions<U> = U extends PointValue4d
		? Point4dInputParams
		: U extends PointValue3d
		? Point3dInputParams & { w: unknown }
		: U extends PointValue2d
		? Point2dInputParams & { z: unknown; w: unknown }
		: unknown;

	export type PointValue2d = { x: number; y: number } | [x: number, y: number];
	export type PointValue3d =
		| { x: number; y: number; z: number }
		| [x: number, y: number, z: number];
	export type PointValue4d =
		| { x: number; y: number; z: number; w: number }
		| [x: number, y: number, z: number, w: number];

	export type PointOptionsX<T extends PointValue2d | PointValue3d | PointValue4d> =
		PointOptions<T>['x'];
	export type PointOptionsY<T extends PointValue2d | PointValue3d | PointValue4d> =
		PointOptions<T>['y'];
	export type PointOptionsZ<T extends PointValue2d | PointValue3d | PointValue4d> =
		PointOptions<T>['z'];
	export type PointOptionsW<T extends PointValue2d | PointValue3d | PointValue4d> =
		PointOptions<T>['w'];
</script>

<script lang="ts" generics="T extends PointValue2d | PointValue3d | PointValue4d">
	import type { Point2dObject } from '@tweakpane/core/dist/input-binding/point-2d/model/point-2d.js';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js';
	import type { ComponentProps } from 'svelte';
	import GenericInputFolding from '../internal/GenericInputFolding.svelte';
	import { BROWSER } from 'esm-env';

	// TODO weird behavior on HMRs?
	type InternalPoint<U> = U extends PointValue4d
		? Point4dObject
		: U extends PointValue3d
		? Point3dObject
		: U extends PointValue2d
		? Point2dObject
		: unknown;

	// some redefinition of props from GenericSlider, but redefining since we want to refine the documentation anyway
	interface $$Props
		extends Omit<
			ComponentProps<GenericInputFolding<T, PointOptions<T>>>,
			'options' | 'buttonClass' | 'ref' | 'plugin'
		> {
		/**
		 * The minimum value for all dimensions.
		 * @default `undefined` (no minimum)
		 * */
		min?: number;
		/**
		 * The maximum value for all dimensions.
		 * @default `undefined` (no maximum)
		 * */
		max?: number;
		/**
		 * The minimum step interval for all dimensions.
		 * @default `undefined` (no step constraint)
		 * */
		step?: number;
		/**
		 * The unit scale for pointer-based input for all dimensions.
		 * @default [dynamic based on magnitude of `value`](https://github.com/cocopon/tweakpane/blob/66dfbea04bfe9b7f031673c955ceda1f92356e75/packages/core/src/common/number/util.ts#L54)
		 * */
		pointerScale?: number;
		/**
		 * The unit scale for key-based input for all dimensions (e.g. the up and down arrow keys).
		 * @default `1` or `stepValue` if defined
		 *  */
		keyScale?: number;
		/**
		 * A function to customize the point value's formatting (e.g. rounding, etc.).
		 * @default `undefined` (normal `.toString()` formatting)
		 * */
		format?: (value: number) => string;
		/**
		 * Input parameters specific to the X dimension.
		 *
		 * Renamed from `x` in Tweakpane API to clarify that it is an object of options, not a value.
		 * @default `undefined`
		 * */
		optionsX?: PointOptionsX<T>;
		/**
		 * Input parameters specific to the Y dimension.
		 *
		 * For 2D point values, the object also includes the `inverted` key, which inverts the Y axis.
		 *
		 * Renamed from `y` in Tweakpane API to clarify that it is an object of options, not a value.
		 * @default `undefined` (`inverted` is `false`)
		 * */
		optionsY?: PointOptionsY<T>;
		/**
		 * Input parameters specific to the Z dimension.
		 *
		 * Renamed from `z` in Tweakpane API to clarify that it is an object of options, not a value.
		 * @default `undefined`
		 * */
		optionsZ?: PointOptionsZ<T>;
		/**
		 * Input parameters specific to the W dimension.
		 *
		 * Renamed from `w` in Tweakpane API to clarify that it is an object of options, not a value.
		 * @default `undefined`
		 * */
		optionsW?: PointOptionsW<T>;
		/**
		 * A 2D, 3D, or 4D point object to control.
		 *
		 * Takes a tuple with a `number` value for each dimension, or an object with at least `x` and `y` values, and optionally `z` and `w` values for additional dimensions.
		 * @bindable
		 * */
		value: T;
	}

	// reexported for bindability
	export let value: $$Props['value'];
	export let expanded: $$Props['expanded'] = false;
	export let pointerScale: $$Props['pointerScale'] = undefined;
	export let keyScale: $$Props['keyScale'] = undefined;
	export let min: $$Props['min'] = undefined;
	export let max: $$Props['max'] = undefined;
	export let step: $$Props['step'] = undefined;
	export let optionsX: $$Props['optionsX'] = undefined; // no proxy needed
	export let optionsY: $$Props['optionsY'] = undefined; // no proxy needed
	export let optionsZ: $$Props['optionsZ'] = undefined; // no proxy needed
	export let optionsW: $$Props['optionsW'] = undefined; // no proxy needed
	export let format: $$Props['format'] = undefined; // no proxy needed

	// proxy value since Tweakpane only supports PointNdObject type
	let internalValue: InternalPoint<T>;

	let options: PointOptions<T>;

	// work-arounds for funky folding
	const buttonClass = 'tp-p2dv_b';

	function updateInternalValue() {
		if (Array.isArray(value)) {
			if (value.length === 4) {
				const [x, y, z, w] = value;
				internalValue = { x, y, z, w } as InternalPoint<T>;
			} else if (value.length === 3) {
				const [x, y, z] = value;
				internalValue = { x, y, z } as InternalPoint<T>;
			} else {
				const [x, y] = value;
				internalValue = { x, y } as InternalPoint<T>;
			}
		} else {
			internalValue = value as InternalPoint<T>;
		}
	}

	function updateValue() {
		if (Array.isArray(value)) {
			if ('w' in internalValue) {
				const { x, y, z, w } = internalValue;
				value = [x, y, z, w] as T;
			} else if ('z' in internalValue) {
				const { x, y, z } = internalValue;
				value = [x, y, z] as T;
			} else {
				const { x, y } = internalValue;
				value = [x, y] as T;
			}
		} else {
			value = internalValue as T;
		}
	}

	$: value, BROWSER && updateInternalValue();
	$: internalValue, BROWSER && updateValue();
	$: BROWSER &&
		(options = {
			pointerScale,
			keyScale,
			min,
			max,
			step,
			x: optionsX,
			y: optionsY,
			z: optionsZ,
			w: optionsW,
			format
		} as PointOptions<T>);
</script>

<!--
@component
Wraps the Tweakpane [point bindings](https://tweakpane.github.io/docs/input-bindings/#point).

Provides a nice cartesian picker for 2D points, and numeric input fields for 3D and 4D points. See the <RotationEuler> and <RotationQuaternion> components for higher-dimension graphical pickers.

Extends the vanilla Tweakpane APIs to also support tuple values. (Useful when working with frameworks like [three.js](https://threejs.org).)

Usage outside of a `<Pane>` component will implicitly wrap the point picker in a `<Pane position='inline'>` component.

@example	
```tsx
<script lang="ts">
	import { Point, PointValue2d, PointValue3d, PointValue4d, PointOptionsX } from 'svelte-tweakpane-ui';
	
	let point2d:PointValue2d = { x: 0, y: 0 };
	
	// tuples are also fine
	let point3d:PointValue3d = [0, 0, 0];

	// dimension-specific option type needs to know the type of the point value
	let point3dXOptions: PointOptionsX<typeof point3d> = { min: -100, max: 100 };

	let point4d:PointValue4d = { x: 0, y: 0, z: 0, w: 0 };
</script>

<Point label="2D Point Picker" bind:value={point2d} picker="inline" expanded={true} clickToExpand={false} />
<Point label="3D Point Picker" bind:value={point3d} optionsX={point3dXOptions} />
<Point label="4D Point Picker" bind:value={point4d} min={0} max={100} />

<pre>
	2D Value: {JSON.stringify(point2d)}
	3D Value: {JSON.stringify(point3d)}
	4D Value: {JSON.stringify(point4d)}
</pre>
```

@sourceLink
-->

{#if BROWSER}
	<GenericInputFolding
		bind:value={internalValue}
		bind:expanded
		{buttonClass}
		{options}
		{...$$restProps}
	/>
{/if}
