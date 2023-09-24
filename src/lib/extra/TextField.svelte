<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let value: string;
	export let theme: Theme | undefined = undefined;
</script>

<GenericInput {label} {disabled} {theme} bind:value />
