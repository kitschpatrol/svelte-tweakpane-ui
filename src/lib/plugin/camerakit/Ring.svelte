<script lang="ts" context="module">
	import type { RingSeries } from '@tweakpane/plugin-camerakit/dist/types/util.js';

	// TODO maybe spread RingUnit into the top level props?

	//  import type { RingUnit } from '@tweakpane/plugin-camerakit/dist/types/view/ring.d.ts';
	// redefine RingUnit with additional documentation
	type RingUnit = {
		/**
		 * The number of pixels per unit.
		 *
		 * This is the amount of space in pixels between each `value` labeled on the ring.
		 * For example, if `pixels` is 100 and `value` is 10, you will see a value label
		 * on the ring in the form of 10...(100 pixels)...20...(100 pixels)...30... etc.
		 */
		pixels: number;
		/**
		 * The number of vertical tick marks between each `value` label on the ring.
		 *
		 * For example, if `pixels` is `100`, `value` is `10, and `ticks` is `10`,
		 * you will have a vertical tick mark every 10 pixels, and a value label
		 * every 100 pixels.
		 */
		ticks: number;
		/**
		 * The value for the unit.
		 *
		 * This sets the interval between each `value` labeled on the ring.
		 * For example a `value` of `20` will show value labels 0, 20, 40... etc.
		 * spaced accrding to the `pixels` value.
		 */
		value: number;
	};

	export type { RingSeries, RingUnit };
</script>

<script lang="ts">
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	import * as pluginModule from '@tweakpane/plugin-camerakit';
	import type { RingInputParams } from '@tweakpane/plugin-camerakit/dist/types/util.d.ts';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	type $$Props = Omit<ComponentProps<GenericSlider<number>>, 'ref' | 'options' | 'plugin'> & {
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
		 * When `true`, expand the width of the ring control at the expense of the numerical input field.
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

	$: BROWSER &&
		(options = {
			view: 'cameraring',
			series,
			unit,
			wide
		});
</script>

<!--
@component
TODO

@example
```svelte
<script lang="ts">
  import { Ring, type RingUnit } from 'svelte-tweakpane-ui';

  let unitConfig: RingUnit = {
    pixels: 40,
    ticks: 5,
    value: 20
  };

  let angle = 45;
</script>

<Ring
  bind:value={angle}
  unit={unitConfig}
  pointerScale={-2.5}
  format={(v) => `${(Math.abs(v) % 360).toFixed(0)}°`}
  wide={true}
/>

<div class="demo" style:--a="{angle}deg" />

<style>
  div.demo {
    background: linear-gradient(var(--a), magenta, orange);
    width: 100%;
    aspect-ratio: 1;
  }
</style>
```

@sourceLink [Ring.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/camerakit/Ring.svelte)
-->

{#if BROWSER}
	<GenericSlider bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
