<script lang="ts">
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import { removeKeys } from '$lib/utils.js';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<ComponentProps<GenericPane>, 'userCreatedPane'> & {
		/**
		 * Horizontal position of the pane relative to the left edge of the window, in pixels.
		 *
		 * Not to be confused with the `position` prop which defines _how_, not _where_, the pane is
		 * positioned on the page. (So-named because of its similarity to CSS `position` property.)
		 * @default `undefined`  \
		 * 8 pixels from the right edge of the window.
		 * */
		x?: number;
		/**
		 * Vertical position of the pane relative to the top of the window, in pixels.
		 *
		 * Not to be confused with the `position` prop which defines _how_, not _where_, the pane is
		 * positioned on the page. (So-named because of its similarity to CSS `position` property.)
		 * @default `undefined`  \
		 * 8 pixels from the top edge of the window.
		 * */
		y?: number;
		/**
		 * Width of the pane, in pixels.
		 * @default `256`
		 * */
		width?: number;
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Slots = {
		/**
		 * Any Tweakpane component, except another `<Pane>`.
		 */
		default: {};
	};

	// Reexport for bindability
	export let expanded: $$Props['expanded'] = undefined;
	export let x: $$Props['x'] = undefined;
	export let y: $$Props['y'] = undefined;
	export let width: $$Props['width'] = undefined;
	export let title: $$Props['title'] = 'Tweakpane';
	export let tpPane: $$Props['tpPane'] = undefined;

	let paneContainer: HTMLElement;

	$: tpPane?.element.parentElement && (paneContainer = tpPane.element.parentElement);

	$: paneContainer !== undefined &&
		x !== undefined &&
		(paneContainer.style.setProperty('right', 'unset'),
		paneContainer.style.setProperty('left', `${x}px`));

	$: paneContainer !== undefined &&
		y !== undefined &&
		paneContainer.style.setProperty('top', `${y}px`);

	$: paneContainer !== undefined &&
		width !== undefined &&
		paneContainer.style.setProperty('width', `${width}px`);

	// Div wrapper is required for element index calculation
	// TODO does this really work with inline?
</script>

<!--
@component  
This component is for internal use only.

Implements the default tweakpane behavior... opens in a fixed position.

@sourceLink
[InternalPaneFixed.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/InternalPaneFixed.svelte)
-->

<div style="display: none;">
	<GenericPane bind:expanded bind:tpPane {title} {...removeKeys($$restProps, 'position')}>
		<slot />
	</GenericPane>
</div>
