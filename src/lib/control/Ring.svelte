<script context="module" lang="ts">
	import type { RingSeries } from '@kitschpatrol/tweakpane-plugin-camerakit/dist/types/util.js'
	import type { ValueChangeEvent } from '$lib/utils.js'

	// TODO maybe spread RingUnit into the top level props?

	//  import type { RingUnit } from '@kitschpatrol/tweakpane-plugin-camerakit/dist/types/view/ring.d.ts';
	// redefine RingUnit with additional documentation
	type RingUnit = {
		/**
		 * The value for the unit.
		 *
		 * This sets the interval between each `value` labeled on the ring. For example a `value` of
		 * `20` will show value labels 0, 20, 40... etc. spaced according to the `pixels` value.
		 */
		value: number
		/**
		 * The number of pixels per unit.
		 *
		 * This is the amount of space in pixels between each `value` labeled on the ring. For
		 * example, if `pixels` is 100 and `value` is 10, you will see a value label on the ring in
		 * the form of 10...(100 pixels)...20...(100 pixels)...30... etc.
		 */
		pixels: number
		/**
		 * The number of vertical tick marks between each `value` label on the ring.
		 *
		 * For example, if `pixels` is `100`, `value` is `10, and `ticks` is `10`, you will have a
		 * vertical tick mark every 10 pixels, and a value label every 100 pixels.
		 */
		ticks: number
	}

	// eslint-disable-next-line unicorn/prefer-export-from
	export type { RingSeries, RingUnit }
	export type RingChangeEvent = ValueChangeEvent<number>
</script>

<script lang="ts">
	import type { RingInputParams } from '@kitschpatrol/tweakpane-plugin-camerakit/dist/types/util.d.ts'
	import type { ComponentProps } from 'svelte'
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-camerakit'
	import GenericSlider from '$lib/internal/GenericSlider.svelte'

	type $$Props = Omit<ComponentProps<GenericSlider<number>>, 'options' | 'plugin' | 'ref'> & {
		/**
		 * A `number` value to control.
		 * @bindable
		 */
		value: number
		/**
		 * Style variations.
		 * @default `0`
		 */
		series?: RingSeries
		/**
		 * Density and value mapping of the ring's tick marks.
		 * @default `{ ticks: 5, pixels: 40, value: 10 }`
		 */
		unit?: RingUnit
	}

	// Reexport for bindability
	export let value: $$Props['value']
	export let series: $$Props['series'] = undefined
	export let unit: $$Props['unit'] = undefined
	export let wide: $$Props['wide'] = undefined

	// Inheriting here with ComponentEvents makes a documentation mess

	type $$Events = {
		/**
		 * Fires when `value` changes.
		 *
		 * _This event is provided for advanced use cases. It's usually preferred to bind to the `value` prop instead._
		 *
		 * The `event.details` payload includes a copy of the value and an `origin` field to distinguish between user-interactive changes (`internal`)
		 * and changes resulting from programmatic manipulation of the `value` (`external`).
		 * @extends ValueChangeEvent
		 * @event
		 */
		change: RingChangeEvent
	}

	let options: RingInputParams

	$: options = {
		series,
		unit,
		view: 'cameraring',
		wide,
	}
</script>

<!--
@component  

A control evoking the focus ring on a proper camera lens.

Similar in functionality to a `<Slider>`.

Integrates the [Ring](https://github.com/tweakpane/plugin-camerakit/blob/main/src/plugin-ring.ts)
control from Tweakpane-creator [Hiroki Kokubun's](https://cocopon.me) [CameraKit
plugin](https://github.com/tweakpane/plugin-camerakit).

Usage outside of a `<Pane>` component will implicitly wrap the ring in `<Pane position="inline">`.

Note that _Svelte Tweakpane UI_ embeds a functionally identical [fork](https://github.com/kitschpatrol/tweakpane-plugin-camerakit) of the plugin with build optimizations. The fork also changes the package name from `@tweakpane/plugin-camerakit` to `@kitschpatrol/tweakpane-plugin-camerakit` for consistency with other plugins.

@emits {RingChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import { Ring, type RingUnit } from 'svelte-tweakpane-ui'

  let unitConfig: RingUnit = {
    value: 20,
    pixels: 40,
    ticks: 5,
  }

  let angle = 45
</script>

<Ring
  bind:value={angle}
  format={(v) => `${(Math.abs(v) % 360).toFixed(0)}°`}
  pointerScale={-2.5}
  unit={unitConfig}
  wide={true}
/>

<div class="demo" style:--a="{angle}deg"></div>

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

<GenericSlider bind:value on:change {options} plugin={pluginModule} {...$$restProps} />
