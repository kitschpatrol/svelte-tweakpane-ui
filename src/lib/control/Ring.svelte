<script context="module" lang="ts">
	import type { RingSeries } from '@tweakpane/plugin-camerakit/dist/types/util.js';

	// TODO maybe spread RingUnit into the top level props?

	//  import type { RingUnit } from '@tweakpane/plugin-camerakit/dist/types/view/ring.d.ts';
	// redefine RingUnit with additional documentation
	type RingUnit = {
		/**
		 * The value for the unit.
		 *
		 * This sets the interval between each `value` labeled on the ring. For example a `value` of
		 * `20` will show value labels 0, 20, 40... etc. spaced according to the `pixels` value.
		 */
		value: number;
		/**
		 * The number of pixels per unit.
		 *
		 * This is the amount of space in pixels between each `value` labeled on the ring. For
		 * example, if `pixels` is 100 and `value` is 10, you will see a value label on the ring in
		 * the form of 10...(100 pixels)...20...(100 pixels)...30... etc.
		 */
		pixels: number;
		/**
		 * The number of vertical tick marks between each `value` label on the ring.
		 *
		 * For example, if `pixels` is `100`, `value` is `10, and `ticks` is `10`, you will have a
		 * vertical tick mark every 10 pixels, and a value label every 100 pixels.
		 */
		ticks: number;
	};

	export type { RingSeries, RingUnit };
</script>

<script lang="ts">
	import * as pluginModule from '@tweakpane/plugin-camerakit';
	import type { RingInputParams } from '@tweakpane/plugin-camerakit/dist/types/util.d.ts';
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<ComponentProps<GenericSlider<number>>, 'options' | 'plugin' | 'ref'> & {
		/**
		 * A `number` value to control.
		 * @bindable
		 * */
		value: number;
		/**
		 * Style variations.
		 * @default `0`
		 * */
		series?: RingSeries;
		/**
		 * Density and value mapping of the ring's tick marks.
		 * @default `{ ticks: 5, pixels: 40, value: 10 }`
		 * */
		unit?: RingUnit;
		/**
		 * When `true`, expand the width of the ring control at the expense of the numerical input
		 * field.
		 * @default `false`
		 * */
		wide?: boolean;
	};

	// reexport for bindability
	export let value: $$Props['value'];
	export let series: $$Props['series'] = undefined;
	export let unit: $$Props['unit'] = undefined;
	export let wide: $$Props['wide'] = undefined;

	let options: RingInputParams;

	$: options = {
		series,
		unit,
		view: 'cameraring',
		wide
	};
</script>

<!--
@component  

A control evoking the focus ring on a proper camera lens.

Similar in functionality to a `<Slider>`.

Integrates the [Ring](https://github.com/tweakpane/plugin-camerakit/blob/main/src/plugin-ring.ts)
control from Tweakpane-creator [Hiroki Kokubun's](https://cocopon.me) [Camerakit
plugin](https://github.com/tweakpane/plugin-camerakit).

Usage outside of a `<Pane>` component will implicitly wrap the ring in `<Pane position='inline'>`.

@example  
```svelte
<script lang="ts">
import { Ring, type RingUnit } from 'svelte-tweakpane-ui';

let unitConfig: RingUnit = {
  value: 20,
  pixels: 40,
  ticks: 5
};

let angle = 45;
</script>

<Ring
  bind:value={angle}
  format={(v) => `${(Math.abs(v) % 360).toFixed(0)}°`}
  pointerScale={-2.5}
  unit={unitConfig}
  wide={true}
/>

<div class="demo" style:--a="{angle}deg" />

<style>
div.demo {
  aspect-ratio: 1;
  width: 100%;
  background: linear-gradient(var(--a), magenta, orange);
}
</style>
```

@sourceLink
[Ring.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Ring.svelte)
-->

<GenericSlider bind:value {options} plugin={pluginModule} {...$$restProps} />
