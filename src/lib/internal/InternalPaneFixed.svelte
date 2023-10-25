<script lang="ts">
	import GenericPane from './GenericPane.svelte';
	import type { ComponentProps } from 'svelte';
	import type { Pane as TpPane } from 'tweakpane';
	import { BROWSER } from 'esm-env';
	import { removeKeys } from '../utils.js';

	interface $$Props extends Omit<ComponentProps<GenericPane>, 'paneRef' | 'userCreatedPane'> {
		/**
		 * Horizontal position of the pane relative to the left edge of the window, in pixels.
		 *
		 * Not to be confused with the `position` prop which defines _how_, not _where_, the pane is positioned on the page. (So-named because of its similarity to CSS `position` property.)
		 * @default `undefined` (8 pixels from the right edge of the window)
		 * */
		x?: number;
		/**
		 * Vertical position of the pane relative to the top of the window, in pixels.
		 *
		 * Not to be confused with the `position` prop which defines _how_, not _where_, the pane is positioned on the page. (So-named because of its similarity to CSS `position` property.)
		 * @default `undefined` (8 pixels from the top edge of the window)
		 * */
		y?: number;
		/**
		 * Width of the pane, in pixels.
		 * @default `256`
		 * */
		width?: number;
	}

	// reexport for bindability
	export let expanded: $$Props['expanded'] = undefined;
	export let x: $$Props['x'] = undefined;
	export let y: $$Props['y'] = undefined;
	export let width: $$Props['width'] = undefined;
	export let title: $$Props['title'] = 'Tweakpane';

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

	$: BROWSER &&
		paneRef !== undefined &&
		paneRef.element.parentElement &&
		(paneContainer = paneRef.element.parentElement);
	$: BROWSER && paneContainer !== undefined && x !== undefined && setPosition();
	$: BROWSER && paneContainer !== undefined && y !== undefined && setPosition();
	$: BROWSER && paneContainer !== undefined && width !== undefined && setPosition();

	// div wrapper is required for element index calculation
</script>

<!--
@component
This component is for internal use only.

Implements the default tweakpane behavior... opens in a fixed position.

@sourceLink
-->

{#if BROWSER}
	<div style="display: none;">
		<GenericPane bind:expanded bind:paneRef {title} {...removeKeys($$restProps, 'position')}>
			<slot />
		</GenericPane>
	</div>
{/if}
