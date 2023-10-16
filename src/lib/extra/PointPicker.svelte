<script lang="ts" generics="U extends Point2dObject | Point3dObject | Point4dObject">
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte';
	import type { Theme } from '$lib/theme.js';
	import type { PickerLayout } from '@tweakpane/core';
	import type { Point2dObject } from '@tweakpane/core/dist/input-binding/point-2d/model/point-2d.js';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js';
	import type { Point2dInputParams, Point3dInputParams, Point4dInputParams } from 'tweakpane';

	// TODO weird behavior on HMRs

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

	/** Prevent interactivity. Defaults to `false`. */
	export let disabled: boolean = false;

	/** Text displayed next to control. Defaults to `undefined.` */
	export let label: string | undefined = undefined;

	/** Custom color scheme. Only applies if the `<PointPicker>` is created outside a `<Pane>` component. */
	export let theme: Theme | undefined = undefined;

	/** Expand or collapse the 2D point picker. Defaults to `true`. Applies only to 2D values, ignored for 3D and 4D. Bindable. */
	export let expanded: boolean | undefined = undefined;

	/** Allow users to interactively expand / contract the picker. Regardless of `clickToExpand`, programmatic control remains available through the `expanded` prop. Applies only to 2D values, ignored for 3D and 4D. Defaults to `true`. */
	export let clickToExpand: boolean = true;

	/** Specify an `inline` or `popup` point picker control presentation. Defaults to `popup`. */
	export let picker: PickerLayout | undefined = undefined;

	//  unique

	/** A 2D, 3D, or 4D point object to control. An object with at least `x` and `y` values, and optionally `z` and `w` values for additional dimensions. */
	export let value: U;

	/** A function to customize the point value's formatting (e.g. rounding, etc.).  */
	export let format: ((value: number) => string) | undefined = undefined;

	/** The unit scale for key-based input for all dimensions (e.g. up the up and down arrow keys). */
	export let keyScale: number | undefined = undefined;

	/** The maximum value for all dimensions. */
	export let max: number | undefined = undefined;

	/** The minimum value for all dimensions. */
	export let min: number | undefined = undefined;

	/** The unit scale for pointer-based input for all dimensions .*/
	export let pointerScale: number | undefined = undefined;

	/** The minimum step interval for all dimensions. */
	export let step: number | undefined = undefined;

	// TODO confirm override behavior
	/** Input parameters specific to the X dimension. Takes an object with `format`, `keyScale`, `max`, `min`, `pointerScale`, and `step` keys, behaving the same as and overriding the top-level props of the same name. */
	export let x: PointParams<U>['x'] = undefined;

	/** Input parameters specific to the Y dimension. Takes an object with `format`, `keyScale`, `max`, `min`, `pointerScale`, and `step` keys, behaving the same as and overriding the top-level props of the same name. */
	export let y: PointParams<U>['y'] = undefined;

	/** Input parameters specific to the Z dimension. Takes an object with `format`, `keyScale`, `max`, `min`, `pointerScale`, and `step` keys, behaving the same as and overriding the top-level props of the same name. */
	export let z: PointParams<U>['z'] = undefined;

	/** Input parameters specific to the W dimension. Takes an object with `format`, `keyScale`, `max`, `min`, `pointerScale`, and `step` keys, behaving the same as and overriding the top-level props of the same name. */
	export let w: PointParams<U>['w'] = undefined;

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
	} as PointParams<U>; // Hmm
</script>

<!--
@component
Wraps the Tweakpane [point bindings](https://tweakpane.github.io/docs/input-bindings/#point).

Provides a nice cartesian picker for 2D points, and numeric input fields for 3D and 4D points. See the <RotationEuler> and <RotationQuaternion> components for higher-dimension graphical pickers.

Usage outside of a `<Pane>` component will implicitly wrap the point picker in a `<Pane mode='inline' ...>` component.

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

<PointPicker label="2D Point Picker" bind:value={point2d} picker="inline" expanded={true} />
<PointPicker label="3D Point Picker" bind:value={point3d} />
<PointPicker label="4D Point Picker" bind:value={point4d} min={0} max={100} />
```
-->

<GenericInputFolding
	bind:expanded
	{picker}
	{buttonClass}
	bind:value
	{clickToExpand}
	{label}
	{disabled}
	{bindingParams}
	{theme}
/>
