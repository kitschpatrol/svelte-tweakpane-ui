<script lang="ts">
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	import type { ComponentProps } from 'svelte';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface $$Props extends ComponentProps<GenericSlider<number>> {}

	export let value: number;
</script>

<GenericSlider bind:value {...$$restProps} />
