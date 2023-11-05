<script lang="ts" context="module">
	import type { Simplify } from '$lib/utils';

	import type { PointDimensionParams } from '@tweakpane/core';

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
	// note name collission with options params
	import GenericInputFolding from '$lib/internal/GenericInputFolding.svelte';
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-rotation';
	import type { RotationInputPluginQuaternionParams as RotationQuaternionOptionsInternal } from '@kitschpatrol/tweakpane-plugin-rotation/dist/types/RotationInputPluginQuaternionParams';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	// TODO add some utility functions to get matrices etc. from quaternions?
	type $$Props = Omit<
		ComponentProps<GenericInputFolding<RotationQuaternionValue, RotationQuaternionOptionsInternal>>,
		'buttonClass' | 'options' | 'ref' | 'plugin'
	> & {
		/**
		 * Input parameters specific to the X dimension.
		 *
		 * Renamed from `x` in TweakpaneRotationPlugin API to clarify that it is an object of options, not a value.
		 * @default `undefined`
		 * */
		optionsX?: RotationQuaternionOptions;
		/**
		 * Input parameters specific to the Y dimension.
		 *
		 * Renamed from `y` in TweakpaneRotationPlugin API to clarify that it is an object of options, not a value.
		 * @default `undefined`
		 * */
		optionsY?: RotationQuaternionOptions;
		/**
		 * Input parameters specific to the Z dimension.
		 *
		 * Renamed from `z` in TweakpaneRotationPlugin API to clarify that it is an object of options, not a value.
		 * @default `undefined`
		 * */
		optionsZ?: RotationQuaternionOptions;
		/**
		 * Input parameters specific to the W dimension.
		 *
		 * Renamed from `w` in TweakpaneRotationPlugin API to clarify that it is an object of options, not a value.
		 * @default `undefined`
		 * */
		optionsW?: RotationQuaternionOptions;
		/**
		 * The quaternion value to control.
		 *
		 * Tuple values are a convenience added by `svelte-tweakpane-ui`, and is not part of the original TweakpaneRotationPlugin API.
		 * @bindable
		 * */
		value: RotationQuaternionValue;
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

	$: value, BROWSER && updateInternalValue();
	$: internalValue, BROWSER && updateValue();
	$: BROWSER &&
		(options = {
			view: 'rotation',
			rotationMode: 'quaternion',
			x: optionsX,
			y: optionsY,
			z: optionsZ,
			w: optionsW
		});
</script>

<!--
@component
TODO

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
<Button title="Reset" on:click={() => (value = [0, 0, 0, 0])} />

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

@sourceLink [RotationQuaternion.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/RotationQuaternion.svelte)
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
