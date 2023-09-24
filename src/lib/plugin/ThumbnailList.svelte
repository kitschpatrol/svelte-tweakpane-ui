<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { Thumbnail } from 'tweakpane-plugin-thumbnail-list/dist/types/controller.js';
	import type { Theme } from '$lib/theme.js';

	// TODO this is broken for some reason

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;
	export let value: string; // this api is kind of weird... takes the 'value' key on the options

	// unique
	export let options: Thumbnail[];

	$: bindingParams = {
		view: 'thumbnail-list',
		options
	};
</script>

<GenericInput {label} {disabled} {bindingParams} {theme} bind:value />
