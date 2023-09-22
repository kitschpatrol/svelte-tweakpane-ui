<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';

	// re-exported
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;

	// unique
	export let value: number;
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let step: number | undefined = undefined;
	export let pointerScale: number | undefined = undefined;
	export let keyScale: number | undefined = undefined;
	export let format: ((value: number) => string) | undefined = undefined;
	export let amount: number | undefined = undefined;
	export let wide: boolean | undefined = undefined;

	let bindingParams = {
		view: 'camerawheel',
		min,
		max,
		step,
		pointerScale,
		keyScale,
		format,
		amount,
		wide,
		value
	};
</script>

<GenericInput bind:value {disabled} {label} {bindingParams} />
