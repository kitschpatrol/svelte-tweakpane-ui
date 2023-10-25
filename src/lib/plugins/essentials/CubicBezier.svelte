<script lang="ts" context="module">
	export type CubicBezierValue =
		| {
				x1: number;
				y1: number;
				x2: number;
				y2: number;
		  }
		| [x1: number, y1: number, x2: number, y2: number];
</script>

<script lang="ts">
	import type { CubicBezierBladeParams as CubicBezierOptions } from '@tweakpane/plugin-essentials/dist/types/cubic-bezier/plugin.d.ts';
	import GenericBladeFolding from '../../internal/GenericBladeFolding.svelte';
	import type { CubicBezierApi as CubicBezierRef } from '@tweakpane/plugin-essentials';
	import { CubicBezier } from '@tweakpane/plugin-essentials';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	type $$Props = Omit<
		ComponentProps<GenericBladeFolding<CubicBezierOptions, CubicBezierRef>>,
		'ref' | 'options' | 'plugin'
	> & {
		/**
		 * The cubic bezier value to control.
		 *
		 * Object value type is a convenience added by `svelte-tweakpane-ui`, and is not part of the original `@tweakpane/plugin-essentials` API.
		 * @type {CubicBezierValue}
		 * @bindable
		 */
		value: CubicBezierValue;
		/**
		 * Text displayed next to the control.
		 * @default `undefined`
		 * */
		label?: string;
	};

	// reexport for bindability
	export let label: $$Props['label'] = undefined;
	export let value: $$Props['value'];
	export let expanded: $$Props['expanded'] = undefined;

	let options: CubicBezierOptions;
	let cubicBezierBlade: CubicBezierRef;

	// work-arounds for funky folding
	const buttonClass = 'tp-cbzv_b';

	function getValue(): CubicBezierOptions['value'] {
		if (Array.isArray(value)) {
			return value;
		} else {
			return [value.x1, value.y1, value.x2, value.y2];
		}
	}

	function setValue() {
		if (Array.isArray(value)) {
			cubicBezierBlade.value = new CubicBezier(value[0], value[1], value[2], value[3]);
		} else {
			cubicBezierBlade.value = new CubicBezier(value.x1, value.y1, value.x2, value.y2);
		}
	}

	function addEvent() {
		cubicBezierBlade.on('change', (ev) => {
			if (Array.isArray(value)) {
				value = [ev.value.x1, ev.value.y1, ev.value.x2, ev.value.y2];
			} else {
				value = {
					x1: ev.value.x1,
					x2: ev.value.x2,
					y1: ev.value.y1,
					y2: ev.value.y2
				};
			}
		});
	}

	$: BROWSER &&
		(options = {
			view: 'cubicbezier',
			label,
			value: getValue()
		});
	$: BROWSER && cubicBezierBlade && addEvent();
	$: value, BROWSER && cubicBezierBlade && setValue();
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
	<GenericBladeFolding
		bind:expanded
		bind:ref={cubicBezierBlade}
		plugin={pluginModule}
		{buttonClass}
		{options}
		{...$$restProps}
	/>
{/if}
