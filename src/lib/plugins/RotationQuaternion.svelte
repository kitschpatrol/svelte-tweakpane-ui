<script lang="ts" context="module">
	import type { PointDimensionParams } from '@tweakpane/core';

	export type RotationQuaternionOptions = PointDimensionParams;
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
	// note name collission with options params
	import * as pluginModule from '@0b5vr/tweakpane-plugin-rotation';
	import GenericInputFolding from '../internal/GenericInputFolding.svelte';
	import type { Point4dObject } from '@tweakpane/core/dist/input-binding/point-4d/model/point-4d';
	import type { ComponentProps } from 'svelte';
	import type { RotationInputPluginQuaternionParams as RotationQuaternionOptionsInternal } from '@0b5vr/tweakpane-plugin-rotation/dist/types/RotationInputPluginQuaternionParams';
	import { BROWSER } from 'esm-env';

	interface $$Props
		extends Omit<
			ComponentProps<
				GenericInputFolding<RotationQuaternionValue, RotationQuaternionOptionsInternal>
			>,
			'buttonClass' | 'options' | 'ref' | 'plugin'
		> {
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
	}

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
```tsx
TODO
```

@sourceLink
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
