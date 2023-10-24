<script lang="ts">
	import GenericSlider from '../../internal/GenericSlider.svelte';
	import * as pluginModule from '@tweakpane/plugin-camerakit';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<ComponentProps<GenericSlider<number>>, 'ref' | 'options' | 'plugin'> {
		/** A `number` value to control. Bindable. */
		value: number;
		/** The amount of the value to change per pixel. */
		amount?: number;
		/** When `true`, expand the width of the wheel control at the expense of the numerical input field. */
		wide?: boolean;
	}

	export let value: $$Props['value'];
	export let amount: $$Props['amount'] = undefined;
	export let wide: $$Props['wide'] = undefined;

	$: options = {
		view: 'camerawheel',
		amount,
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
