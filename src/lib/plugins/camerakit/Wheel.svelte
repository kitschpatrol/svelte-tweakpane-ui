<script lang="ts">
	import GenericSlider from '../../internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<ComponentProps<GenericSlider<number>>, 'bindingRef' | 'bindingParams' | 'plugin'> {
		/** A `number` value to control. Bindable. */
		value: number;
		//** The amount of the value to change per pixel. */
		amount?: number;
		/** When `true`, expand the width of the wheel control at the expense of the numerical input field. */
		wide?: boolean;
	}

	export let value: $$Props['value'];
	export let amount: $$Props['amount'] = undefined;
	export let wide: $$Props['wide'] = undefined;

	$: bindingParams = {
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
-->

{#await import('@tweakpane/plugin-camerakit') then module}
	<GenericSlider bind:value {bindingParams} plugin={module} {...$$restProps} />
{/await}
