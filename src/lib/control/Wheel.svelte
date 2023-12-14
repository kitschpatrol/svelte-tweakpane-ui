<script lang="ts">
	import * as pluginModule from '@tweakpane/plugin-camerakit';
	import type { WheelInputParams } from '@tweakpane/plugin-camerakit/dist/types/util.d.ts';
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<ComponentProps<GenericSlider<number>>, 'options' | 'plugin' | 'ref'> & {
		/**
		 * A `number` value to control.
		 * @bindable
		 * */
		value: number;
		/** The amount of the value to change per pixel of movement.
		 * @default `undefined`  \
		 * [Dynamic based on magnitude of
		 * `value`](https://github.com/cocopon/tweakpane/blob/66dfbea04bfe9b7f031673c955ceda1f92356e75/packages/core/src/common/number/util.ts#L54).
		 */
		amount?: number;
		/**
		 * When `true`, expand the width of the wheel control at the expense of the numerical input
		 * field.
		 * @default `false`
		 * */
		wide?: boolean;
	};

	// Reexport for bindability
	export let value: $$Props['value'];
	export let amount: $$Props['amount'] = undefined;
	export let wide: $$Props['wide'] = undefined;

	let options: WheelInputParams;

	$: options = {
		amount,
		view: 'camerawheel',
		wide
	};
</script>

<!--
@component  

A control evoking a dial on a proper camera body.

Similar in functionality to a `<Slider>`.

Integrates the [Wheel](https://github.com/tweakpane/plugin-camerakit/blob/main/src/plugin-wheel.ts)
control from Tweakpane-creator [Hiroki Kokubun's](https://cocopon.me) [Camerakit
plugin](https://github.com/tweakpane/plugin-camerakit).

Usage outside of a `<Pane>` component will implicitly wrap the wheel in `<Pane position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { Wheel } from 'svelte-tweakpane-ui';

  let angle = 45;
</script>

<Wheel
  bind:value={angle}
  format={(v) => `${(Math.abs(v) % 360).toFixed(0)}°`}
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
[Wheel.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/control/Wheel.svelte)
-->

<GenericSlider bind:value {options} plugin={pluginModule} {...$$restProps} />
