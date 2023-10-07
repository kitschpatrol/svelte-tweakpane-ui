<script lang="ts">
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import type { Theme } from '$lib/theme.js';
	import { BROWSER } from 'esm-env';
	import type { Pane as TpPane } from 'tweakpane';

	/** Text in the pane's title bar. If undefined, no title bar is shown, and expanding / collapsing the pane will only be available through the `expanded` prop.  */
	export let title: string | undefined = undefined;

	/** Whether the pane may be collapsed by clicking the title bar. */
	export let collapsable: boolean = true;

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
The root `<Pane>` component, used for organizing controls into a single group.

This component is a wrapper around Tweakpane's [Pane](https://tweakpane.github.io/docs/api/classes/Pane.html) class.

This variation of `<Pane>` exhibits the default Tweakpane behavior of displaying in a fixed position over the page.

Unlike Vanilla JS Tweakpane, wrapping components in a `<Pane>` is not mandatory. Pane-less components will be automatically nested in a `<InternalPaneInline>` component and displayed in the regular block flow of the page instead of in a fixed element.

Multiple `<Pane>` components may be added to a single page, but note that by default they will overlap one another. Set the `x` or `y` properties to prevent overlap.

See the `<InternalPaneInline>` and `<InternalPaneDraggable>` components for additional functionality. 

Note that the [`container`](https://tweakpane.github.io/docs/misc/#container) [PaneConfig](https://tweakpane.github.io/docs/api/interfaces/_internal_.PaneConfig.html) option is not exposed, because correct placement in the containing DOM is managed by 'svelte-tweakpane-ui', and `<InternalPaneInline>` should be used where you'd like a pane to become part of the normal document flow.

Example:	
```tsx
<Pane title="Tweakpane Normal">
	<Button title="Reticulate" on:click={() => alert('Reticulation complete')} />
</Pane>
```
-->

{#if BROWSER}
	<div style="display: none;">
		<GenericPane bind:expanded {title} {theme} {collapsable} bind:paneRef>
			<slot />
		</GenericPane>
	</div>
{/if}
