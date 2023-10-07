<script lang="ts">
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import type { Theme } from '$lib/theme.js';
	import { BROWSER } from 'esm-env';
	import type { Pane as TpPane } from 'tweakpane';

	export let title: string | undefined = undefined;
	export let expanded: boolean = true; // special case
	export let theme: Theme | undefined = undefined;

	export let x: number | undefined = undefined;
	export let y: number | undefined = undefined;
	export let width: number | undefined = undefined;

	let paneRef: TpPane;
	let paneContainer: HTMLElement;

	function setPosition() {
		if (paneContainer !== undefined) {
			if (x !== undefined) {
				paneContainer.style.setProperty('right', 'unset');
				paneContainer.style.setProperty('left', `${x}px`);
			}
			if (y !== undefined) {
				paneContainer.style.setProperty('top', `${y}px`);
			}
			if (width !== undefined) {
				paneContainer.style.setProperty('width', `${width}px`);
			}
		}
	}

	$: paneRef !== undefined &&
		paneRef.element.parentElement &&
		(paneContainer = paneRef.element.parentElement);
	$: paneContainer !== undefined && x !== undefined && setPosition();
	$: paneContainer !== undefined && y !== undefined && setPosition();
	$: paneContainer !== undefined && width !== undefined && setPosition();

	// default tweakpane behavior... opens in a fixed position
	// div wrapper is required for element index calculation
</script>

{#if BROWSER}
	<div style="display: none;">
		<GenericPane bind:expanded {title} {theme} {collapsable} bind:paneRef>
			<slot />
		</GenericPane>
	</div>
{/if}
