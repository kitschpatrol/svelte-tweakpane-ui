<script context="module" lang="ts">
	import type { ValueChangeEvent } from '$lib/utils.js'

	export type WheelChangeEvent = ValueChangeEvent<number>
</script>

<script lang="ts">
	import type { WheelInputParams } from '@kitschpatrol/tweakpane-plugin-camerakit/dist/types/util.d.ts'
	import type { ComponentProps } from 'svelte'
	import GenericSlider from '$lib/internal/GenericSlider.svelte'
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-camerakit'

	type $$Props = {
		/**
		 * A `number` value to control.
		 * @bindable
		 * */
		value: number
		/** The amount of the value to change per pixel of movement.
		 * @default `undefined`  \
		 * [Dynamic based on magnitude of
		 * `value`](https://github.com/cocopon/tweakpane/blob/66dfbea04bfe9b7f031673c955ceda1f92356e75/packages/core/src/common/number/util.ts#L54).
		 */
		amount?: number
	} & Omit<ComponentProps<GenericSlider<number>>, 'options' | 'plugin' | 'ref'>

	// Reexport for bindability
	export let value: $$Props['value']
	export let amount: $$Props['amount'] = undefined
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
		 *
		 * @extends ValueChangeEvent
		 * @event
		 * */
		change: WheelChangeEvent
	}

	let options: WheelInputParams

	$: options = {
		amount,
		view: 'camerawheel',
		wide,
	}
</script>

<!--
@component  

A control evoking a dial on a proper camera body.

Similar in functionality to a `<Slider>`.

Integrates the [Wheel](https://github.com/tweakpane/plugin-camerakit/blob/main/src/plugin-wheel.ts)
control from Tweakpane-creator [Hiroki Kokubun's](https://cocopon.me) [Camerakit
plugin](https://github.com/tweakpane/plugin-camerakit).

Usage outside of a `<Pane>` component will implicitly wrap the wheel in `<Pane position="inline">`.

Note that _Svelte Tweakpane UI_ embeds a functionally identical [fork](https://github.com/kitschpatrol/tweakpane-plugin-camerakit) of the plugin with build optimizations. The fork also changes the package name from `@tweakpane/plugin-camerakit` to `@kitschpatrol/tweakpane-plugin-camerakit` for consistency with other plugins.

@emits {WheelChangeEvent} change - When `value` changes. (This event is provided for advanced use cases. Prefer binding to `value`.)

@example  
```svelte
<script lang="ts">
  import { Wheel } from 'svelte-tweakpane-ui'

  let angle = 45
</script>

<Wheel
  bind:value={angle}
  format={(v) => `${(Math.abs(v) % 360).toFixed(0)}°`}
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
[Wheel.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Wheel.svelte)
-->

<GenericSlider bind:value on:change {options} plugin={pluginModule} {...$$restProps} />
