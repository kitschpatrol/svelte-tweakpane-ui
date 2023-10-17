<script lang="ts">
	import GenericInputFolding from '../internal/GenericInputFolding.svelte';
	import type { PointDimensionParams } from '@tweakpane/core';
	import type { ComponentProps } from 'svelte';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d.js';

	interface $$Props
		extends Omit<
			ComponentProps<GenericInputFolding<Point4dObject>>,
			'buttonClass' | 'bindingParams' | 'bindingRef' | 'plugin'
		> {
		/** TODO Docs */
		x?: PointDimensionParams;
		/** TODO Docs */
		y?: PointDimensionParams;
		/** TODO Docs */
		z?: PointDimensionParams;
		/** TODO Docs */
		w?: PointDimensionParams;
		/** TODO Docs */
		value: Point4dObject;
	}

	// unique
	export let value: $$Props['value'];

	export let x: $$Props['x'] = undefined;
	export let y: $$Props['y'] = undefined;
	export let z: $$Props['z'] = undefined;
	export let w: $$Props['w'] = undefined;

	// reexport for binding
	export let expanded: $$Props['expanded'] = undefined;

	// work-arounds for funky folding
	const buttonClass = 'tp-rotationswatchv_b';

	$: bindingParams = {
		view: 'rotation',
		rotationMode: 'quaternion',
		x,
		y,
		z,
		w
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
