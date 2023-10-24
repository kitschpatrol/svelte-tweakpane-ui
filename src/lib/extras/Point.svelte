<script lang="ts" context="module">
	// TODO test this
	export type PointValue2d = { x: number; y: number } | [x: number, y: number];
	export type PointValue3d =
		| { x: number; y: number; z: number }
		| [x: number, y: number, z: number];
	export type PointValue4d =
		| { x: number; y: number; z: number; w: number }
		| [x: number, y: number, z: number, w: number];
</script>

<script lang="ts" generics="T extends PointValue2d | PointValue3d | PointValue4d">
	import GenericInputFolding from '../internal/GenericInputFolding.svelte';
	import type { ComponentProps } from 'svelte';
	import type { Point2dObject } from '@tweakpane/core/dist/input-binding/point-2d/model/point-2d.js';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js';
	import type { Point2dInputParams, Point3dInputParams, Point4dInputParams } from 'tweakpane';

	// TODO weird behavior on HMRs
	// TODO how to make certain props conditional on T
	// https://stackoverflow.com/questions/76553208/dynamic-props-for-svelte-component

	type PointParams<U> = U extends PointValue4d
		? Point4dInputParams
		: U extends PointValue3d
		? Point3dInputParams & { w: unknown }
		: U extends PointValue2d
		? Point2dInputParams & { z: unknown; w: unknown }
		: unknown;

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
			ComponentProps<GenericInputFolding<T, PointParams<T>>>,
			'options' | 'buttonClass' | 'ref' | 'plugin'
		> {
		/** The maximum value for all dimensions. */
		min?: number;
		/** The minimum value for all dimensions. */
		max?: number;
		/** The minimum step interval for all dimensions. */
		step?: number;
		/** The unit scale for pointer-based input for all dimensions .*/
		pointerScale?: number;
		/** The unit scale for key-based input for all dimensions (e.g. up the up and down arrow keys). */
		keyScale?: number;
		/** A function to customize the point value's formatting (e.g. rounding, etc.). Note that this only changes the view / labels within the control, `value` will still return an unformatted number. */
		format?: (value: number) => string;
		/** Input parameters specific to the X dimension. Takes an object with `format`, `keyScale`, `max`, `min`, `pointerScale`, and `step` keys, behaving the same as and overriding the top-level props of the same name. */
		x?: PointParams<T>['x'];
		/** Input parameters specific to the Y dimension. Takes an object with `format`, `keyScale`, `max`, `min`, `pointerScale`, and `step` keys, behaving the same as and overriding the top-level props of the same name. */
		y?: PointParams<T>['y'];
		/** Input parameters specific to the Z dimension. Takes an object with `format`, `keyScale`, `max`, `min`, `pointerScale`, and `step` keys, behaving the same as and overriding the top-level props of the same name. */
		z?: PointParams<T>['z'];
		/** Input parameters specific to the W dimension. Takes an object with `format`, `keyScale`, `max`, `min`, `pointerScale`, and `step` keys, behaving the same as and overriding the top-level props of the same name. */
		w?: PointParams<T>['w'];
		/** A 2D, 3D, or 4D point object to control. An object with at least `x` and `y` values, and optionally `z` and `w` values for additional dimensions. */
		value: T;
	}

	export let value: $$Props['value'];
	export let expanded: $$Props['expanded'] = false;
	export let pointerScale: $$Props['pointerScale'] = undefined;
	export let keyScale: $$Props['keyScale'] = undefined;
	export let min: $$Props['min'] = undefined;
	export let max: $$Props['max'] = undefined;
	export let step: $$Props['step'] = undefined;
	export let x: $$Props['x'] = undefined; // no proxy needed
	export let y: $$Props['y'] = undefined; // no proxy needed
	export let z: $$Props['z'] = undefined; // no proxy needed
	export let w: $$Props['w'] = undefined; // no proxy needed
	export let format: $$Props['format'] = undefined; // no proxy needed

	// proxy value since Tweakpane only supports PointNdObject type
	let internalValue: InternalPoint<T>;

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

	$: value, updateInternalValue();
	$: internalValue, updateValue();
	$: options = {
		pointerScale,
		keyScale,
		min,
		max,
		step,
		x,
		y,
		z,
		w,
		format
	} as PointParams<T>; // Hmm why bother
</script>

<!--
@component
Wraps the Tweakpane [point bindings](https://tweakpane.github.io/docs/input-bindings/#point).

Provides a nice cartesian picker for 2D points, and numeric input fields for 3D and 4D points. See the <RotationEuler> and <RotationQuaternion> components for higher-dimension graphical pickers.

Usage outside of a `<Pane>` component will implicitly wrap the point picker in a `<Pane position='inline'>` component.

Example:	
```tsx
<script lang="ts">	
	let point2d = { x: 0, y: 0 };
	let point3d = { x: 0, y: 0, z: 0 };
	let point4d = { x: 0, y: 0, z: 0, w: 0 };

	$: console.log(point2d);
	$: console.log(point3d);
	$: console.log(point4d);
</script>

<Point label="2D Point Picker" bind:value={point2d} picker="inline" expanded={true} clickToExpand={false} />
<Point label="3D Point Picker" bind:value={point3d} />
<Point label="4D Point Picker" bind:value={point4d} min={0} max={100} />
```

@sourceLink
-->

<GenericInputFolding
	bind:value={internalValue}
	bind:expanded
	{buttonClass}
	{options}
	{...$$restProps}
/>
