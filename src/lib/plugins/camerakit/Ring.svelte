<script lang="ts" context="module">
	import type { RingSeries } from '@tweakpane/plugin-camerakit/dist/types/util.js';
	import type { RingUnit } from '@tweakpane/plugin-camerakit/dist/types/view/ring.d.ts';

	export type { RingSeries, RingUnit };
</script>

<script lang="ts">
	import GenericSlider from '../../internal/GenericSlider.svelte';
	import * as pluginModule from '@tweakpane/plugin-camerakit';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<ComponentProps<GenericSlider<number>>, 'ref' | 'options' | 'plugin'> {
		/** A `number` value to control. Bindable. */
		value: number;
		/** Style variations, takes values of `0` `1` or `2`. */
		series?: RingSeries;
		/** The scale of the ring's units. Takes an object of the form `{pixels: number, ticks: number, value: number}` */
		unit?: RingUnit;
		/** When `true`, expand the width of the ring control at the expense of the numerical input field. */
		wide?: boolean;
	}

	export let value: $$Props['value'];
	export let series: $$Props['series'] = undefined;
	export let unit: $$Props['unit'] = undefined;
	export let wide: $$Props['wide'] = undefined;

	$: options = {
		view: 'cameraring',
		series,
		unit,
		wide
	};
</script>

<!--
@component
TODO

Example:
```tsx
TODO
```

@sourceLink
-->

<GenericSlider bind:value {options} plugin={pluginModule} {...$$restProps} />
