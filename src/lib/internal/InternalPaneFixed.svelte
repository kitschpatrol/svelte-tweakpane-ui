<script lang="ts">
	import GenericPane from './GenericPane.svelte';
	import type { ComponentProps } from 'svelte';
	import type { Pane as TpPane } from 'tweakpane';
	import { BROWSER } from 'esm-env';
	import { removeKeys } from '../utils.js';

	interface $$Props extends Omit<ComponentProps<GenericPane>, 'paneRef' | 'userCreatedPane'> {
		/** Horizontal position of the pane, in pixels. (Defaults to the right.) */
		x?: number;
		/** Vertical position of the pane, in pixels. (Defaults to the top.) */
		y?: number;
		/** Width of the pane, in pixels. (Defaults to 256.) */
		width?: number;
	}

	export let expanded: $$Props['expanded'] = undefined;
	let paneRef: TpPane;
	export let x: $$Props['x'] = undefined;
	export let y: $$Props['y'] = undefined;
	export let width: $$Props['width'] = undefined;

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

	// function setPosition() {
	// 	if (paneContainer !== undefined) {
	// 		console.log('set position');
	// 		console.log(x);
	// 		console.log(y);
	// 		console.log(width);
	// 		paneContainer.style.setProperty('right', x !== undefined ? 'unset' : '0px');
	// 		paneContainer.style.setProperty('left', x !== undefined ? `${x}px` : 'unset');
	// 		paneContainer.style.setProperty('top', y !== undefined ? `${y}px` : '0px');
	// 		paneContainer.style.setProperty('width', width !== undefined ? `${width}px` : '100px');
	// 	}
	// }

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

@sourceLink
-->

{#if BROWSER}
	<div style="display: none;">
		<GenericPane bind:expanded bind:paneRef {...removeKeys($$restProps, 'position')}>
			<slot />
		</GenericPane>
	</div>
{/if}
