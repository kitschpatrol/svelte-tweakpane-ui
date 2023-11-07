<script context="module" lang="ts">
	import type { EulerOrder } from '@kitschpatrol/tweakpane-plugin-rotation/dist/types/EulerOrder.js';
	import type { EulerUnit } from '@kitschpatrol/tweakpane-plugin-rotation/dist/types/EulerUnit.js';
	import type { PointDimensionParams } from '@tweakpane/core';
	import type { Simplify } from '$lib/utils';

	export type RotationEulerOptions = Simplify<PointDimensionParams>;
	export type RotationEulerOrder = EulerOrder;
	export type RotationEulerUnit = EulerUnit;

	export type RotationEulerValueObject = {
		x: number;
		y: number;
		z: number;
	};
	export type RotationEulerValueTuple = [x: number, y: number, z: number];
	export type RotationEulerValue = Simplify<RotationEulerValueObject | RotationEulerValueTuple>;

	// don't support order, for now
</script>

<script lang="ts">
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-rotation';
	import type { RotationInputPluginEulerParams as RotationEulerOptionsInternal } from '@kitschpatrol/tweakpane-plugin-rotation/dist/types/RotationInputPluginEulerParams';
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js'; // note name collision with options params
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<
		ComponentProps<GenericInputFolding<RotationEulerValue, RotationEulerOptionsInternal>>,
		'buttonClass' | 'options' | 'plugin' | 'ref'
	> & {
		/**
		 * The rotation value to control.
		 *
		 * Tuple values are a convenience added by `svelte-tweakpane-ui`, and are not part of the
		 * original TweakpaneRotationPlugin API.
		 *
		 * See the `order` prop to specify the sequence in which rotations are applied.
		 * @bindable
		 * */
		value: RotationEulerValue;
		/**
		 * Input parameters specific to the X dimension.
		 *
		 * Renamed from `x` in the original TweakpaneRotationPlugin API to clarify that it is an
		 * object of options, not a value.
		 * @default `undefined`
		 * */
		optionsX?: RotationEulerOptions;
		/**
		 * Input parameters specific to the Y dimension.
		 *
		 * Renamed from `y` in the original TweakpaneRotationPlugin API to clarify that it is an
		 * object of options, not a value.
		 * @default `undefined`
		 * */
		optionsY?: RotationEulerOptions;
		/**
		 * Input parameters specific to the Z dimension.
		 *
		 * Renamed from `z` in the original TweakpaneRotationPlugin API to clarify that it is an
		 * object of options, not a value.
		 * @default `undefined`
		 * */
		optionsZ?: RotationEulerOptions;
		/**
		 * Order of in which rotations are applied.
		 *
		 * Note that this is extrinsic rotations (used by Blender, Maya, and Unity). Three.js uses
		 * intrinsic rotations, so you have to reverse the order if you want to match Three.js'
		 * behavior.
		 * @default `'XYZ'`
		 * */
		order?: RotationEulerOrder;
		/**
		 * Units of rotation.
		 * @default `'rad'`
		 */
		unit?: RotationEulerUnit;
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

	// work-around for funky folding
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
			x: optionsX,
			y: optionsY,
			z: optionsZ,
			order,
			rotationMode: 'euler',
			unit,
			view: 'rotation'
		});
</script>

<!--
@component  
TODO Component documentation...

TK

@example  
```svelte
<script lang="ts">
  import {
    Button,
    RotationEuler,
    type RotationEulerUnit,
    type RotationEulerValueObject,
    Utils
  } from 'svelte-tweakpane-ui';

  // Value could also be a tuple
  // e.g. [0, 0, 0]
  let value: RotationEulerValueObject = { x: 0, y: 0, z: 0 };

  $: transform = Utils.eulerToCssTransform(value);
  $: valueRows = Object.values(value)
    .map((v) => `${v >= 0 ? '+' : ''}${v.toFixed(6)}`)
    .join('\n');
</script>

<RotationEuler
  bind:value
  expanded={true}
  label="CSS Rotation"
  picker={'inline'}
/>
<Button on:click={() => (value = { x: 0, y: 0, z: 0 })} title="Reset" />

<div class="billboard" style:transform>
  <pre>{valueRows}</pre>
</div>

<style>
  div.billboard {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    width: 100%;
    background: linear-gradient(45deg, magenta, orange);
  }
</style>
```

@sourceLink
[RotationEuler.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/RotationEuler.svelte)
-->

{#if BROWSER}
	<GenericInputFolding
		bind:value={internalValue}
		bind:expanded
		{buttonClass}
		{options}
		plugin={pluginModule}
		{...$$restProps}
	/>
{/if}
