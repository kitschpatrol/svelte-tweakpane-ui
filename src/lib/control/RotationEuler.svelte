<script context="module" lang="ts">
	import type { Simplify } from '$lib/utils'
	import type { ValueChangeEvent } from '$lib/utils.js'
	import type { EulerOrder } from '@kitschpatrol/tweakpane-plugin-rotation/dist/types/EulerOrder.js'
	import type { EulerUnit } from '@kitschpatrol/tweakpane-plugin-rotation/dist/types/EulerUnit.js'
	import type { PointDimensionParams } from '@tweakpane/core'

	export type RotationEulerOptions = Simplify<PointDimensionParams>
	export type RotationEulerOrder = EulerOrder
	export type RotationEulerUnit = EulerUnit

	export type RotationEulerValueObject = {
		x: number
		y: number
		z: number
	}
	export type RotationEulerValueTuple = [x: number, y: number, z: number]
	export type RotationEulerValue = Simplify<RotationEulerValueObject | RotationEulerValueTuple>

	export type RotationEulerChangeEvent = ValueChangeEvent<RotationEulerValue>
	// Don't support order, for now
</script>

<script lang="ts">
	import type { RotationInputPluginEulerParams as RotationEulerOptionsInternal } from '@kitschpatrol/tweakpane-plugin-rotation/dist/types/RotationInputPluginEulerParams'
	import type { Point3dObject } from '@tweakpane/core/dist/input-binding/point-3d/model/point-3d.js'
	import type { ComponentProps } from 'svelte' // Note name collision with options params
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte'
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-rotation'
	import { BROWSER } from 'esm-env'
	import { shallowEqual } from 'fast-equals'

	type $$Props = {
		/**
		 * The rotation value to control.
		 *
		 * Tuple values are a convenience added by _Svelte Tweakpane UI_, and are not part of the
		 * original TweakpaneRotationPlugin API.
		 *
		 * See the `order` prop to specify the sequence in which rotations are applied.
		 * @bindable
		 * */
		value: RotationEulerValue
		/**
		 * Input parameters specific to the X dimension.
		 *
		 * Renamed from `x` in the original TweakpaneRotationPlugin API to clarify that it is an
		 * object of options, not a value.
		 * @default `undefined`
		 * */
		optionsX?: RotationEulerOptions
		/**
		 * Input parameters specific to the Y dimension.
		 *
		 * Renamed from `y` in the original TweakpaneRotationPlugin API to clarify that it is an
		 * object of options, not a value.
		 * @default `undefined`
		 * */
		optionsY?: RotationEulerOptions
		/**
		 * Input parameters specific to the Z dimension.
		 *
		 * Renamed from `z` in the original TweakpaneRotationPlugin API to clarify that it is an
		 * object of options, not a value.
		 * @default `undefined`
		 * */
		optionsZ?: RotationEulerOptions
		/**
		 * Order of in which rotations are applied.
		 *
		 * Note that this is extrinsic rotations (used by Blender, Maya, and Unity). Three.js uses
		 * intrinsic rotations, so you have to reverse the order if you want to match Three.js'
		 * behavior.
		 * @default `'XYZ'`
		 * */
		order?: RotationEulerOrder
		/**
		 * Units of rotation.
		 * @default `'rad'`
		 */
		unit?: RotationEulerUnit
	} & Omit<
		ComponentProps<GenericInputFolding<RotationEulerValue, RotationEulerOptionsInternal>>,
		'buttonClass' | 'options' | 'plugin' | 'ref'
	>

	// Unique
	export let value: $$Props['value']
	export let order: $$Props['order'] = undefined
	export let unit: $$Props['unit'] = undefined
	export let optionsX: $$Props['optionsX'] = undefined
	export let optionsY: $$Props['optionsY'] = undefined
	export let optionsZ: $$Props['optionsZ'] = undefined

	// Reexport for binding
	export let expanded: $$Props['expanded'] = undefined

	// Inheriting here with ComponentEvents makes a documentation mess

	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 *
		 * @extends ValueChangeEvent
		 * @event
		 * */
		change: RotationEulerChangeEvent
	}

	let options: RotationEulerOptionsInternal

	// Proxy value since Tweakpane only supports Point3dObject type
	let internalValue: Point3dObject

	// Work-around for funky folding
	const buttonClass = 'tp-rotationswatchv_b'

	function updateInternalValueFromValue() {
		if (Array.isArray(value)) {
			const newInternalValue = { x: value[0], y: value[1], z: value[2] }
			if (!shallowEqual(newInternalValue, internalValue)) {
				internalValue = newInternalValue
			}
		} else if (!shallowEqual(value, internalValue)) {
			internalValue = { ...value }
		}
	}

	function updateValueFromInternalValue() {
		if (Array.isArray(value)) {
			const newValue: RotationEulerValueTuple = [internalValue.x, internalValue.y, internalValue.z]
			if (!shallowEqual(newValue, value)) {
				value = newValue
			}
		} else if (!shallowEqual(internalValue, value)) {
			value = { ...internalValue }
		}
	}

	$: value, updateInternalValueFromValue()
	$: internalValue, updateValueFromInternalValue()
	$: options = {
		x: optionsX,
		y: optionsY,
		z: optionsZ,
		order,
		rotationMode: 'euler',
		unit,
		view: 'rotation',
	}
</script>

<!--
@component  
Integrates the [euler
rotation](https://github.com/0b5vr/tweakpane-plugin-rotation/blob/dev/src/RotationInputPluginEuler.ts)
control from [0b5vr](https://0b5vr.com)'s [tweakpane-plugin-rotation](https://github.com/0b5vr/tweakpane-plugin-rotation).

_Svelte Tweakpane UI_ extends the original API to support tuple values in addition to object values.
(Useful when working with frameworks like [three.js](https://threejs.org) /
[threlte](https://threlte.xyz).)

A utility function `Utils.eulerToCssTransform()` is also provided to easily convert a quaternion
value object or tuple into a CSS transform string.

See also `<RotationQuaternion>` if you're feeling gimbal locked.

Usage outside of a `<Pane>` component will implicitly wrap the profiler in `<Pane
position="inline">`.

Note that _Svelte Tweakpane UI_ embeds a functionally identical [fork](https://github.com/kitschpatrol/tweakpane-plugin-rotation) of the plugin with build optimizations.

@emits {RotationEulerChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import {
    Button,
    RotationEuler,
    type RotationEulerValueObject,
    Utils
  } from 'svelte-tweakpane-ui';

  // Value could also be a tuple
  // e.g. [0, 0, 0]
  let value: RotationEulerValueObject = {
    x: 0,
    y: 0,
    z: 0
  };

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
<Button
  on:click={() =>
    (value = {
      x: 0,
      y: 0,
      z: 0
    })}
  title="Reset"
/>

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
[RotationEuler.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/RotationEuler.svelte)
-->

<GenericInputFolding
	bind:value={internalValue}
	bind:expanded
	on:change
	{buttonClass}
	{options}
	plugin={pluginModule}
	{...$$restProps}
/>
{#if !BROWSER && expanded && $$props.picker === 'inline'}
	{#if $$props.label !== undefined}
		<ClsPad
			keysAdd={['bladeValueWidth']}
			keysSubtract={[`containerUnitSize`]}
			theme={$$props.theme}
		/>
	{:else}
		<!-- Without a label, the grid takes the full width of the control -->
		<!-- TODO remove magic number -->
		<div style="aspect-ratio: 1; width: calc(100% - 28px);"></div>
	{/if}
{/if}
