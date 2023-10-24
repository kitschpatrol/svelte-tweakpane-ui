<script lang="ts" context="module">
	import type { EulerOrder } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerOrder.js';
	import type { EulerUnit } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerUnit.js';
	export type RotationEulerOrder = EulerOrder;
	export type RotationEulerUnit = EulerUnit;
	export type RotationEulerValue =
		| {
				x: number;
				y: number;
				z: number;
		  }
		| [x: number, y: number, z: number];
	// don't support order, for now
</script>

<script lang="ts">
	import GenericInputFolding from '../internal/GenericInputFolding.svelte';
	import * as pluginModule from '@0b5vr/tweakpane-plugin-rotation';
	import type { PointDimensionParams } from '@tweakpane/core';
	import type { ComponentProps } from 'svelte';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import type { RotationInputPluginEulerParams as RotationEulerOptions } from '@0b5vr/tweakpane-plugin-rotation/dist/types/RotationInputPluginEulerParams';

	interface $$Props
		extends Omit<
			ComponentProps<GenericInputFolding<RotationEulerValue, RotationEulerOptions>>,
			'buttonClass' | 'options' | 'ref' | 'plugin'
		> {
		/** TODO Docs */
		order?: RotationEulerOrder;
		/** TODO Docs */
		unit?: RotationEulerUnit;
		/** TODO Docs */
		x?: PointDimensionParams;
		/** TODO Docs */
		y?: PointDimensionParams;
		/** TODO Docs */
		z?: PointDimensionParams;
		/** TODO Docs */
		value: RotationEulerValue;
	}

	// unique
	export let value: $$Props['value'];
	export let order: $$Props['order'] = undefined;
	export let unit: $$Props['unit'] = undefined;
	export let x: $$Props['x'] = undefined;
	export let y: $$Props['y'] = undefined;
	export let z: $$Props['z'] = undefined;

	// reexport for binding
	export let expanded: $$Props['expanded'] = undefined;

	// proxy value since Tweakpane only supports Point3dObject type
	let internalValue: Point3dObject;

	// work-arounds for funky folding
	const buttonClass = 'tp-rotationswatchv_b';

	function updateInternalValue() {
		if (Array.isArray(value)) {
			const [x, y, z] = value;
			internalValue = { x, y, z };
		} else {
			internalValue = value;
		}
	}

	function updateValue() {
		if (Array.isArray(value)) {
			const { x, y, z } = internalValue;
			value = [x, y, z];
		} else {
			value = internalValue;
		}
	}

	$: value, updateInternalValue();
	$: internalValue, updateValue();
	$: options = {
		view: 'rotation',
		rotationMode: 'euler',
		order,
		unit,
		x,
		y,
		z
	} as RotationEulerOptions;
</script>

<!--
@component
TODO

Example:
```tsx
TODO
```

@sourceLink
-->

<GenericInputFolding
	bind:expanded
	bind:value={internalValue}
	{buttonClass}
	{options}
	plugin={pluginModule}
	{...$$restProps}
/>
