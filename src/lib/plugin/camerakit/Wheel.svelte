<script lang="ts">
	import * as pluginModule from '@tweakpane/plugin-camerakit';
	import type { WheelInputParams } from '@tweakpane/plugin-camerakit/dist/types/util.d.ts';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';
	import GenericSlider from '$lib/internal/GenericSlider.svelte';

	type $$Props = Omit<ComponentProps<GenericSlider<number>>, 'ref' | 'options' | 'plugin'> & {
		/**
		 * A `number` value to control.
		 * @bindable
		 * */
		value: number;
		/** The amount of the value to change per pixel of movement.
		 * @default [dynamic based on magnitude of `value`](https://github.com/cocopon/tweakpane/blob/66dfbea04bfe9b7f031673c955ceda1f92356e75/packages/core/src/common/number/util.ts#L54)
		 */
		amount?: number;
		/**
		 * When `true`, expand the width of the wheel control at the expense of the numerical input field.
		 * @default `false`
		 * */
		wide?: boolean;
	};

	// reexport for bindability
	export let value: $$Props['value'];
	export let amount: $$Props['amount'] = undefined;
	export let wide: $$Props['wide'] = undefined;

	let options: WheelInputParams;

	$: BROWSER &&
		(options = {
			view: 'camerawheel',
			amount,
			wide
		});
</script>

<!--
@component
TODO

@example
```svelte
<script lang="ts">
  import { Wheel } from '$lib';

  let angle = 45;
</script>

<Wheel
  bind:value={angle}
  format={(v) => `${(Math.abs(v) % 360).toFixed(0)}°`}
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

@sourceLink [Wheel.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/camerakit/Wheel.svelte)
-->

{#if BROWSER}
	<GenericSlider bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
