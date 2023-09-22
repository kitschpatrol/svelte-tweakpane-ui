<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	import type { IntervalObject } from '@tweakpane/plugin-essentials/dist/types/interval/model/interval.js';
	interface $$Props extends ComponentProps<GenericSlider<IntervalObject>> {}
	export let value: IntervalObject;
</script>

<GenericSlider bind:value {...$$restProps} />
