<script lang="ts" context="module">
	export type RotationEulerValue =
		| {
				x: number;
				y: number;
				z: number;
		  }
		| [x: number, y: number, z: number];
	// don't support order, for now

	import type { EulerOrder } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerOrder.js';
	import type { EulerUnit } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerUnit.js';
	export type RotationEulerOrder = EulerOrder;
	export type RotationEulerUnit = EulerUnit;
</script>

<script lang="ts">
	import GenericInputFolding from '../internal/GenericInputFolding.svelte';
	import type { PointDimensionParams } from '@tweakpane/core';
	import type { ComponentProps } from 'svelte';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';

	interface $$Props
		extends Omit<
			ComponentProps<GenericInputFolding<RotationEulerValue>>,
			'buttonClass' | 'bindingParams' | 'bindingRef' | 'plugin'
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
	$: bindingParams = {
		view: 'rotation',
		rotationMode: 'euler',
		order,
		unit,
		x,
		y,
		z
	};
</script>

<!--
@component
TODO

Example:
```tsx
TODO
```
-->

{#await import('@0b5vr/tweakpane-plugin-rotation') then module}
	<GenericInputFolding
		bind:expanded
		bind:value={internalValue}
		{buttonClass}
		{bindingParams}
		plugin={module}
		{...$$restProps}
	/>
{/await}
