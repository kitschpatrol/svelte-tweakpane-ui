<script lang="ts">
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import type { Theme } from '$lib/theme.js';
	import { BROWSER } from 'esm-env';
	import { onMount } from 'svelte';
	import type { Pane as TpPane } from 'tweakpane';

	let container: HTMLDivElement;
	export let title: string | undefined = undefined;
	export let expanded: boolean = true; // special case
	export let theme: Theme | undefined = {
		baseBorderRadius: '0px',
		bladeBorderRadius: '0px'
	};
	export let userCreatedPane = true; // internal use
	let paneRef: TpPane;

	onMount(() => {
		container.appendChild(paneRef.element);
	});
</script>

{#if BROWSER}
	<div class="container" bind:this={container}>
		<GenericPane {title} bind:expanded {theme} {userCreatedPane} bind:paneRef>
			<slot />
		</GenericPane>
	</div>
{/if}
