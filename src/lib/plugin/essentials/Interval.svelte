<script lang="ts">
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';
	import type { ComponentProps } from 'svelte';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props extends Omit<ComponentProps<GenericSlider<IntervalObject>>, 'bindingParams'> {
		value: IntervalObject;
	}

	export let value: $$Props['value'];
</script>

<GenericSlider bind:value {...$$restProps} />
