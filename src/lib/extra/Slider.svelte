<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import GenericSlider from '$lib/internal/GenericSlider.svelte';
	interface $$Props extends ComponentProps<GenericSlider<number>> {}
	export let value: number;
</script>

<GenericSlider bind:value {...$$restProps} />
