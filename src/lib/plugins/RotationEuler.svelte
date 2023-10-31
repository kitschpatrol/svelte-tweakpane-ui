<script lang="ts" context="module">
	import type { EulerOrder } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerOrder.js';
	import type { EulerUnit } from '@0b5vr/tweakpane-plugin-rotation/dist/types/EulerUnit.js';
	import type { PointDimensionParams } from '@tweakpane/core';

	export type RotationEulerOptions = PointDimensionParams;
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
	// note name collission with options params
	import * as pluginModule from '@0b5vr/tweakpane-plugin-rotation';
	import type { RotationInputPluginEulerParams as RotationEulerOptionsInternal } from '@0b5vr/tweakpane-plugin-rotation/dist/types/RotationInputPluginEulerParams';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte';

	type $$Props = Omit<
		ComponentProps<GenericInputFolding<RotationEulerValue, RotationEulerOptionsInternal>>,
		'buttonClass' | 'options' | 'ref' | 'plugin'
	> & {
		/**
		 * Order of in which rotations are applied.
		 *
		 * Note that this is extrinsic rotations (used by Blender, Maya, and Unity). Three.js uses intrinsic rotations, so you have to reverse the order if you want to match Three.js' behavior.
		 * @default `'XYZ'`
		 * */
		order?: RotationEulerOrder;
		/**
		 * Units of rotation.
		 * @default `'rad'`
		 */
		unit?: RotationEulerUnit;
		/**
		 * Input parameters specific to the X dimension.
		 *
		 * Renamed from `x` in the original TweakpaneRotationPlugin API to clarify that it is an object of options, not a value.
		 * @default `undefined`
		 * */
		optionsX?: RotationEulerOptions;
		/**
		 * Input parameters specific to the Y dimension.
		 *
		 * Renamed from `y` in the original TweakpaneRotationPlugin API to clarify that it is an object of options, not a value.
		 * @default `undefined`
		 * */
		optionsY?: RotationEulerOptions;
		/**
		 * Input parameters specific to the Z dimension.
		 *
		 * Renamed from `z` in the original TweakpaneRotationPlugin API to clarify that it is an object of options, not a value.
		 * @default `undefined`
		 * */
		optionsZ?: RotationEulerOptions;
		/**
		 * The rotation value to control.
		 *
		 * Tuple values are a convenience added by `svelte-tweakpane-ui`, and is not part of the original TweakpaneRotationPlugin API.
		 *
		 * See the `order` prop to specify the sequence in which rotations are applied.
		 * @bindable
		 * */
		value: RotationEulerValue;
	};

	// unique
	export let value: $$Props['value'];
	export let order: $$Props['order'] = undefined;
	export let unit: $$Props['unit'] = undefined;
	export let optionsX: $$Props['optionsX'] = undefined;
	export let optionsY: $$Props['optionsY'] = undefined;
	export let optionsZ: $$Props['optionsZ'] = undefined;

	// reexport for binding
	export let expanded: $$Props['expanded'] = undefined;

	let options: RotationEulerOptionsInternal;

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

	$: value, BROWSER && updateInternalValue();
	$: internalValue, BROWSER && updateValue();
	$: BROWSER &&
		(options = {
			view: 'rotation',
			rotationMode: 'euler',
			order,
			unit,
			x: optionsX,
			y: optionsY,
			z: optionsZ
		});
</script>

<!--
@component
TODO

@example
```tsx
TODO
```

@sourceLink [RotationEuler.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugins/RotationEuler.svelte)
-->

{#if BROWSER}
	<GenericInputFolding
		bind:expanded
		bind:value={internalValue}
		{buttonClass}
		{options}
		plugin={pluginModule}
		{...$$restProps}
	/>
{/if}
