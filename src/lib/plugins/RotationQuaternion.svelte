<script lang="ts" context="module">
	export type RotationQuaternionValue =
		| {
				x: number;
				y: number;
				z: number;
				w: number;
		  }
		| [x: number, y: number, z: number, w: number];
</script>

<script lang="ts">
	import GenericInputFolding from '../internal/GenericInputFolding.svelte';
	import type { PointDimensionParams } from '@tweakpane/core';
	import type { ComponentProps } from 'svelte';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d';
	import type { RotationInputPluginQuaternionParams as RotationQuaternionOptions } from '@0b5vr/tweakpane-plugin-rotation/dist/types/RotationInputPluginQuaternionParams';

	interface $$Props
		extends Omit<
			ComponentProps<GenericInputFolding<RotationQuaternionValue, RotationQuaternionOptions>>,
			'buttonClass' | 'options' | 'ref' | 'plugin'
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
		value: RotationQuaternionValue;
	}

	// unique
	export let value: $$Props['value'];
	export let x: $$Props['x'] = undefined;
	export let y: $$Props['y'] = undefined;
	export let z: $$Props['z'] = undefined;
	export let w: $$Props['w'] = undefined;

	// reexport for binding
	export let expanded: $$Props['expanded'] = undefined;

	// proxy value since Tweakpane only supports Point4dObject type
	let internalValue: Point4dObject;

	// work-arounds for funky folding
	const buttonClass = 'tp-rotationswatchv_b';

	function updateInternalValue() {
		if (Array.isArray(value)) {
			const [x, y, z, w] = value;
			internalValue = { x, y, z, w };
		} else {
			internalValue = value;
		}
	}

	function updateValue() {
		if (Array.isArray(value)) {
			const { x, y, z, w } = internalValue;
			value = [x, y, z, w];
		} else {
			value = internalValue;
		}
	}

	$: value, updateInternalValue();
	$: internalValue, updateValue();
	$: options = {
		view: 'rotation',
		rotationMode: 'quaternion',
		x,
		y,
		z,
		w
	} as RotationQuaternionOptions;
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
		{options}
		plugin={module}
		{...$$restProps}
	/>
{/await}
