<script lang="ts" context="module">
	import type { RingSeries } from '@tweakpane/plugin-camerakit/dist/types/util.js';
	import type { RingUnit } from '@tweakpane/plugin-camerakit/dist/types/view/ring.d.ts';

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
```tsx
<script lang="ts">
  import { TODO } from 'svelte-tweakpane-ui';
  const status = 'TODO';
</script>

<pre>
{status}
</pre>
```

@sourceLink [Ring.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/camerakit/Ring.svelte)
-->

{#if BROWSER}
	<GenericSlider bind:value {options} plugin={pluginModule} {...$$restProps} />
{/if}
