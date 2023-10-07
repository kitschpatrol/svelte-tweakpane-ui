<script lang="ts">
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import type { Theme } from '$lib/theme.js';
	import { BROWSER } from 'esm-env';
	import { onMount } from 'svelte';
	import type { Pane as TpPane } from 'tweakpane';

	/** Text in the pane's title bar. If undefined, no title bar is shown, and expanding / collapsing the pane will only be available through the `expanded` prop.  */
	export let title: string | undefined = undefined;

	/** Whether the pane may be collapsed by clicking the title bar. Note that <InternalPaneInline> sets this to false by default. */
	export let collapsable: boolean = false;

	/** Expand and collapse the pane into its title bar. Bindable. */
	export let expanded: boolean = true; // special case

	/** Custom color scheme. Applies to all child components. Note that <InternalPaneInline> squares off rounded corners by default to better integrate with surrounding content. */
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
An inline version of the pane component, allowing the Tweakpane window to appear inline with other content in the normal flow of the document.

This component is a wrapper around Tweakpane's [Pane](https://tweakpane.github.io/docs/api/classes/Pane.html) class.

All other `svelte-tweakpane-ui` components which are created without a containing `<Pane> / <InternalPaneInline> / <InternalPaneDraggable>` are nested implicitly inside a titleless `<InternalPaneInline>` component. As such, you do not necessarily need create `<InternalPaneInline>` components in most cases.

`<InternalPaneInline>`'s behavior is similar to creating a Pane in Vanilla JS Tweakpane with its [`container`](https://tweakpane.github.io/docs/misc/#containerElement) property set to its parent element.

See the `<Pane>` and `<InternalPaneDraggable>` components for additional functionality. 

Example:	
```tsx
<InternalPaneInline>
	<Button title="Reticulate" on:click={() => alert('Reticulation complete')} />
</InternalPaneInline>
```
-->

{#if BROWSER}
	<div bind:this={containerElement}>
		<GenericPane {title} bind:expanded {theme} {userCreatedPane} {collapsable} bind:paneRef>
			<slot />
		</GenericPane>
	</div>
{/if}
