<script lang="ts">
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import type { Theme } from '$lib/theme.js';
	import { BROWSER } from 'esm-env';
	import { onMount } from 'svelte';
	import type { Pane as TpPane } from 'tweakpane';

	/** Text in the pane's title bar. If undefined, no title bar is shown, and expanding / collapsing the pane will only be available through the `expanded` prop. */
	export let title: string | undefined = undefined;

	/** Whether the pane may be collapsed by clicking the title bar. */
	export let clickToExpand: boolean = false;

	/** Expand and collapse the pane into its title bar. Bindable. */
	export let expanded: boolean = true; // special case

	/** Custom color scheme. Applies to all child components. Note that `<Pane mode="inline" ...>` squares off rounded corners by default to better integrate with surrounding content. */
	export let theme: Theme | undefined = {
		baseBorderRadius: '0px',
		bladeBorderRadius: '0px'
	};

	/** This prop is for internal use only. */
	export let userCreatedPane = true;

	let containerElement: HTMLDivElement;
	let paneRef: TpPane;

	onMount(() => {
		const fixedContainer = paneRef.element.parentElement;
		containerElement.appendChild(paneRef.element);
		fixedContainer?.remove();
	});
</script>

<!--
@component
This component is for internal use only.
-->

{#if BROWSER}
	<div bind:this={containerElement}>
		<GenericPane {title} bind:expanded {theme} {userCreatedPane} {clickToExpand} bind:paneRef>
			<slot />
		</GenericPane>
	</div>
{/if}
