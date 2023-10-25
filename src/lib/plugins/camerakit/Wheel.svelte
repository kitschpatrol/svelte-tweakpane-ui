<script lang="ts">
	import * as pluginModule from '@tweakpane/plugin-camerakit';
	import type { WheelInputParams } from '@tweakpane/plugin-camerakit/dist/types/util.d.ts';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';
	import GenericSlider from '../../internal/GenericSlider.svelte';

	interface $$Props
		extends Omit<ComponentProps<GenericSlider<number>>, 'ref' | 'options' | 'plugin'> {
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
	}

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
```tsx
TODO
```

@sourceLink
-->

{#if BROWSER}
	<GenericSlider bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
