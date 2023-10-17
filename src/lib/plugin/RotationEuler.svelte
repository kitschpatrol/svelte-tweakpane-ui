<script lang="ts">
	import GenericInputFolding from '../internal/GenericInputFolding.svelte';
	import type { EulerOrder } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerOrder.js';
	import type { EulerUnit } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerUnit.js';
	import type { PointDimensionParams } from '@tweakpane/core';
	import type { ComponentProps } from 'svelte';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';

	interface $$Props
		extends Omit<
			ComponentProps<GenericInputFolding<Point3dObject>>,
			'buttonClass' | 'bindingParams' | 'bindingRef' | 'plugin'
		> {
		/** TODO Docs */
		order?: EulerOrder;
		/** TODO Docs */
		unit?: EulerUnit;
		/** TODO Docs */
		x?: PointDimensionParams;
		/** TODO Docs */
		y?: PointDimensionParams;
		/** TODO Docs */
		z?: PointDimensionParams;
		/** TODO Docs */
		value: Point3dObject;
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

	// work-arounds for funky folding
	const buttonClass = 'tp-rotationswatchv_b';

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
		bind:value
		{buttonClass}
		{bindingParams}
		plugin={module}
		{...$$restProps}
	/>
{/await}
