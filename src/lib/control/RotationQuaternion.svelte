<script context="module" lang="ts">
	import type { Simplify } from '$lib/utils'
	import type { ValueChangeEvent } from '$lib/utils.js'
	import type { PointDimensionParams } from '@tweakpane/core'

	export type RotationQuaternionOptions = Simplify<PointDimensionParams>
	export type RotationQuaternionValueObject = {
		x: number
		y: number
		z: number
		w: number
	}
	export type RotationQuaternionValueTuple = [x: number, y: number, z: number, w: number]
	export type RotationQuaternionValue = Simplify<
		RotationQuaternionValueObject | RotationQuaternionValueTuple
	>
	export type RotationQuaternionChangeEvent = ValueChangeEvent<RotationQuaternionValue>
</script>

<script lang="ts">
	import type { RotationInputPluginQuaternionParams as RotationQuaternionOptionsInternal } from '@kitschpatrol/tweakpane-plugin-rotation/dist/types/RotationInputPluginQuaternionParams'
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d'
	import type { ComponentProps } from 'svelte' // Note name collision with options params
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte'
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-rotation'
	import { BROWSER } from 'esm-env'
	import { shallowEqual } from 'fast-equals'

	// TODO add some utility functions to get matrices etc. from quaternions?
	type $$Props = {
		/**
		 * The quaternion value to control.
		 *
		 * Tuple values are a convenience added by _Svelte Tweakpane UI_, and is not part of the
		 * original TweakpaneRotationPlugin API.
		 * @bindable
		 * */
		value: RotationQuaternionValue
		/**
		 * Input parameters specific to the X dimension.
		 *
		 * Renamed from `x` in TweakpaneRotationPlugin API to clarify that it is an object of
		 * options, not a value.
		 * @default `undefined`
		 * */
		optionsX?: RotationQuaternionOptions
		/**
		 * Input parameters specific to the Y dimension.
		 *
		 * Renamed from `y` in TweakpaneRotationPlugin API to clarify that it is an object of
		 * options, not a value.
		 * @default `undefined`
		 * */
		optionsY?: RotationQuaternionOptions
		/**
		 * Input parameters specific to the Z dimension.
		 *
		 * Renamed from `z` in TweakpaneRotationPlugin API to clarify that it is an object of
		 * options, not a value.
		 * @default `undefined`
		 * */
		optionsZ?: RotationQuaternionOptions
		/**
		 * Input parameters specific to the W dimension.
		 *
		 * Renamed from `w` in TweakpaneRotationPlugin API to clarify that it is an object of
		 * options, not a value.
		 * @default `undefined`
		 * */
		optionsW?: RotationQuaternionOptions
	} & Omit<
		ComponentProps<GenericInputFolding<RotationQuaternionValue, RotationQuaternionOptionsInternal>>,
		'buttonClass' | 'options' | 'plugin' | 'ref'
	>

	// Unique
	export let value: $$Props['value']
	export let optionsX: $$Props['optionsX'] = undefined
	export let optionsY: $$Props['optionsY'] = undefined
	export let optionsZ: $$Props['optionsZ'] = undefined
	export let optionsW: $$Props['optionsW'] = undefined

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
		change: RotationQuaternionChangeEvent
	}

	let options: RotationQuaternionOptionsInternal

	// Proxy value since Tweakpane only supports Point4dObject type
	let internalValue: Point4dObject

	// Work-around for funky folding
	const buttonClass = 'tp-rotationswatchv_b'

	function updateInternalValueFromValue() {
		if (Array.isArray(value)) {
			const newInternalValue = { x: value[0], y: value[1], z: value[2], w: value[3] }
			if (!shallowEqual(newInternalValue, internalValue)) {
				internalValue = newInternalValue
			}
		} else if (!shallowEqual(value, internalValue)) {
			internalValue = { ...value }
		}
	}

	function updateValueFromInternalValue() {
		if (Array.isArray(value)) {
			const newValue: RotationQuaternionValueTuple = [
				internalValue.x,
				internalValue.y,
				internalValue.z,
				internalValue.w,
			]
			if (!shallowEqual(newValue, value)) {
				value = newValue
			}
		} else if (!shallowEqual(internalValue, value)) {
			value = { ...internalValue }
		}
	}

	$: (value, updateInternalValueFromValue())
	$: (internalValue, updateValueFromInternalValue())
	$: options = {
		x: optionsX,
		y: optionsY,
		z: optionsZ,
		w: optionsW,
		rotationMode: 'quaternion',
		view: 'rotation',
	}
</script>

<!--
@component  
Integrates the [quaternion
rotation](https://github.com/0b5vr/tweakpane-plugin-rotation/blob/dev/src/RotationInputPluginQuaternion.ts)
control from [0b5vr](https://0b5vr.com)'s [tweakpane-plugin-rotation](https://github.com/0b5vr/tweakpane-plugin-rotation).

_Svelte Tweakpane UI_ extends the original API to support tuple values in addition to object values.
(Useful when working with frameworks like [three.js](https://threejs.org) /
[threlte](https://threlte.xyz).)

A utility function `Utils.quaternionToCssTransform()` is also provided to easily convert a euler
rotation value object or tuple into a CSS transform string.

See also `<RotationEuler>` if you're not into the whole `w` thing.
	
Usage outside of a `<Pane>` component will implicitly wrap the profiler in `<Pane
position="inline">`.

Note that _Svelte Tweakpane UI_ embeds a functionally identical [fork](https://github.com/kitschpatrol/tweakpane-plugin-rotation) of the plugin with build optimizations.

@emits {RotationQuaternionChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import {
    Button,
    RotationQuaternion,
    type RotationQuaternionValue,
    Utils,
  } from 'svelte-tweakpane-ui'

  // Value could also be an object
  // e.g. {x: 0, y: 0, z: 0, w: 0}
  let value: RotationQuaternionValue = [0, 0, 0, 0]

  $: transform = Utils.quaternionToCssTransform(value)
  $: valueRows = Array.isArray(value)
    ? value.map((v) => `${v >= 0 ? '+' : ''}${v.toFixed(6)}`).join('\n')
    : ''
</script>

<RotationQuaternion
  bind:value
  expanded={true}
  label="CSS Rotation"
  picker="inline"
/>
<Button on:click={() => (value = [0, 0, 0, 0])} title="Reset" />

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
[RotationQuaternion.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/RotationQuaternion.svelte)
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
