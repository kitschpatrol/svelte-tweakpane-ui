<script lang="ts" generics="T extends Point2dObject | Point3dObject | Point4dObject">
	import GenericInputFolding from '../internal/GenericInputFolding.svelte';

	import type { ComponentProps } from 'svelte';
	import type { Point2dObject } from '@tweakpane/core/dist/input-binding/point-2d/model/point-2d.js';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js';
	import type { Point2dInputParams, Point3dInputParams, Point4dInputParams } from 'tweakpane';

	// TODO weird behavior on HMRs
	// TODO how to make certain props conditional on T
	// https://stackoverflow.com/questions/76553208/dynamic-props-for-svelte-component

	type PointParams<U> = U extends Point4dObject
		? Point4dInputParams
		: U extends Point3dObject
		? Point3dInputParams & { w: unknown }
		: U extends Point2dObject
		? Point2dInputParams & { z: unknown; w: unknown }
		: unknown;

	// some redefinition of props from GenericSlider, but redefining since we want to refine the documentation anyway
	interface $$Props
		extends Omit<
			ComponentProps<GenericInputFolding<T>>,
			'bindingParams' | 'buttonClass' | 'bindingRef'
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

	// work-arounds for funky folding
	const buttonClass = 'tp-p2dv_b';

	$: bindingParams = {
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

Usage outside of a `<Pane>` component will implicitly wrap the point picker in a `<Pane position='inline' ...>` component.

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

<PointPicker label="2D Point Picker" bind:value={point2d} picker="inline" expanded={true} clickToExpand={false} />
<PointPicker label="3D Point Picker" bind:value={point3d} />
<PointPicker label="4D Point Picker" bind:value={point4d} min={0} max={100} />
```
-->

<GenericInputFolding bind:value bind:expanded {buttonClass} {bindingParams} {...$$restProps} />
