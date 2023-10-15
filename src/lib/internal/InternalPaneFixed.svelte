<script lang="ts">
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import type { Theme } from '$lib/theme.js';
	import { BROWSER } from 'esm-env';
	import type { Pane as TpPane } from 'tweakpane';

	/** Text in the pane's title bar. If undefined, no title bar is shown, and expanding / collapsing the pane will only be available through the `expanded` prop.  */
	export let title: string | undefined = undefined;

	/** Whether the pane may be collapsed by clicking the title bar. */
	export let clickToExpand: boolean = true;

	/** Expand and collapse the pane into its title bar. Bindable. */
	export let expanded: boolean = true; // special case

	/** Custom color scheme. Applies to all child components.  */
	export let theme: Theme | undefined = undefined;

	/** Horizontal position of the pane, in pixels. (Defaults to the right.) */
	export let x: number | undefined = undefined;

	/** Vertical position of the pane, in pixels. (Defaults to the top.) */
	export let y: number | undefined = undefined;

	/** Width of the pane, in pixels. (Defaults to 256.) */
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

<!--
@component
This component is for internal use only.
-->

{#if BROWSER}
	<div style="display: none;">
		<GenericPane bind:expanded {title} {theme} {clickToExpand} bind:paneRef>
			<slot />
		</GenericPane>
	</div>
{/if}
