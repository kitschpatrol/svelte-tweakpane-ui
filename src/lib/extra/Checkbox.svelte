<script lang="ts">
	import GenericInput from '$lib/internal/GenericInput.svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;

	// unique
	export let value: boolean = false;
</script>

<GenericInput bind:value {label} {disabled} {theme} />
