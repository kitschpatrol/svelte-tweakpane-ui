<script lang="ts">
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props extends Omit<ComponentProps<GenericSlider<number>>, 'bindingParams'> {
		/** A `number` value to control. Bindable. */
		value: number;
		amount?: number;
		wide?: boolean;
	}

	// unique
	export let value: $$Props['value'];
	export let amount: $$Props['amount'] = undefined;
	export let wide: $$Props['wide'] = undefined;

	$: bindingParams = {
		view: 'camerawheel',
		amount,
		wide
	};
</script>

<GenericSlider bind:value {bindingParams} {...$$restProps} />
