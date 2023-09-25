<script lang="ts">
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import type { Theme } from '$lib/theme.js';
	import { BROWSER } from 'esm-env';

	export let title: string | undefined = undefined;
	export let expanded: boolean = true; // special case
	export let theme: Theme | undefined = undefined;

	// default tweakpane behavior... opens in a fixed position
</script>

{#if BROWSER}
	<GenericPane bind:expanded {title} {theme}>
		<slot />
	</GenericPane>
{/if}
