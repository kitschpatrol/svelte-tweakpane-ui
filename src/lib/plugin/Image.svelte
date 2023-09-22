<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { ImageResolvable } from 'tweakpane-image-plugin/dist/types/model.js';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let value: ImageResolvable;

	// unique
	export let imageFit: ('contain' | 'cover') | undefined = undefined;
	export let extensions: string[] | undefined = undefined;

	$: bindingParams = {
		view: 'input-image',
		imageFit,
		extensions
	};
</script>

<GenericInput {label} {disabled} {bindingParams} bind:value />
