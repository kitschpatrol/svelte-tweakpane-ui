<script context="module" lang="ts">
	import type { PointDimensionParams } from '@tweakpane/core';
	import type { Simplify } from '$lib/utils';

	export type RotationQuaternionOptions = Simplify<PointDimensionParams>;
	export type RotationQuaternionValueObject = {
		x: number;
		y: number;
		z: number;
		w: number;
	};
	export type RotationQuaternionValueTuple = [x: number, y: number, z: number, w: number];
	export type RotationQuaternionValue = Simplify<
		RotationQuaternionValueObject | RotationQuaternionValueTuple
	>;
</script>

<script lang="ts">
	import * as pluginModule from '@0b5vr/tweakpane-plugin-rotation';
	import type { RotationInputPluginQuaternionParams as RotationQuaternionOptionsInternal } from '@0b5vr/tweakpane-plugin-rotation/dist/types/RotationInputPluginQuaternionParams';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d'; // note name collision with options params
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	// TODO add some utility functions to get matrices etc. from quaternions?
	type $$Props = Omit<
		ComponentProps<GenericInputFolding<RotationQuaternionValue, RotationQuaternionOptionsInternal>>,
		'buttonClass' | 'options' | 'plugin' | 'ref'
	> & {
		/**
		 * The quaternion value to control.
		 *
		 * Tuple values are a convenience added by _Svelte Tweakpane UI_, and is not part of the
		 * original TweakpaneRotationPlugin API.
		 * @bindable
		 * */
		value: RotationQuaternionValue;
		/**
		 * Input parameters specific to the X dimension.
		 *
		 * Renamed from `x` in TweakpaneRotationPlugin API to clarify that it is an object of
		 * options, not a value.
		 * @default `undefined`
		 * */
		optionsX?: RotationQuaternionOptions;
		/**
		 * Input parameters specific to the Y dimension.
		 *
		 * Renamed from `y` in TweakpaneRotationPlugin API to clarify that it is an object of
		 * options, not a value.
		 * @default `undefined`
		 * */
		optionsY?: RotationQuaternionOptions;
		/**
		 * Input parameters specific to the Z dimension.
		 *
		 * Renamed from `z` in TweakpaneRotationPlugin API to clarify that it is an object of
		 * options, not a value.
		 * @default `undefined`
		 * */
		optionsZ?: RotationQuaternionOptions;
		/**
		 * Input parameters specific to the W dimension.
		 *
		 * Renamed from `w` in TweakpaneRotationPlugin API to clarify that it is an object of
		 * options, not a value.
		 * @default `undefined`
		 * */
		optionsW?: RotationQuaternionOptions;
	};

	// unique
	export let value: $$Props['value'];
	export let optionsX: $$Props['optionsX'] = undefined;
	export let optionsY: $$Props['optionsY'] = undefined;
	export let optionsZ: $$Props['optionsZ'] = undefined;
	export let optionsW: $$Props['optionsW'] = undefined;

	// reexport for binding
	export let expanded: $$Props['expanded'] = undefined;

	let options: RotationQuaternionOptionsInternal;

	// proxy value since Tweakpane only supports Point4dObject type
	let internalValue: Point4dObject;

	// work-around for funky folding
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
		x: optionsX,
		y: optionsY,
		z: optionsZ,
		w: optionsW,
		rotationMode: 'quaternion',
		view: 'rotation'
	};
</script>

<!--
@component  
Integrates the [quaternion
rotation](https://github.com/0b5vr/tweakpane-plugin-rotation/blob/dev/src/RotationInputPluginQuaternion.ts)
control from [0b5vr's](https://0b5vr.com)
[tweakpane-plugin-rotation](https://github.com/0b5vr/tweakpane-plugin-rotation).

_Svelte Tweakpane UI_ extends the original API to support tuple values in addition to object values.
(Useful when working with frameworks like [three.js](https://threejs.org) /
[threlte](https://threlte.xyz).)

A utility function `Utils.quaternionToCssTransform()` is also provided to easily convert a euler
rotation value object or tuple into a CSS transform string.

See also <RotationEuler> if you're not into the whole `w` thing.

Usage outside of a `<Pane>` component will implicitly wrap the profiler in `<Pane
position='inline'>`.






@example  
```svelte
<script lang="ts">
  import {
    Button,
    RotationQuaternion,
    type RotationQuaternionValue,
    Utils
  } from 'svelte-tweakpane-ui';

  // Value could also be an object
  // e.g. {x: 0, y: 0, z: 0, w: 0}
  let value: RotationQuaternionValue = [0, 0, 0, 0];

  $: transform = Utils.quaternionToCssTransform(value);
  $: valueRows = Array.isArray(value)
    ? value.map((v) => `${v >= 0 ? '+' : ''}${v.toFixed(6)}`).join('\n')
    : '';
</script>

<RotationQuaternion
  bind:value
  expanded={true}
  label="CSS Rotation"
  picker={'inline'}
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
		<div style="aspect-ratio: 1; width: calc(100% - 28px);" />
	{/if}
{/if}
