<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import InternalPaneFixed from '$lib/internal/InternalPaneFixed.svelte';
	import InternalPaneDraggable from '$lib/internal/InternalPaneDraggable.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';

	interface PaneDraggableProps extends ComponentProps<InternalPaneDraggable> {
		mode: 'draggable';
	}

	interface PaneInlineProps extends Omit<ComponentProps<InternalPaneInline>, 'userCreatedPane'> {
		mode: 'inline';
	}

	interface PaneFixedProps extends ComponentProps<InternalPaneFixed> {
		mode?: 'fixed';
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = (PaneDraggableProps | PaneInlineProps | PaneFixedProps) & {
		/** Pane mode, one of three options:
		 * - **'fixed'** *(default)*  \
		 *   Standard TweakPane behavior where the pane is shown in a fixed position on the page.
		 * - **'inline'**  \
		 *   The pane appears inline with other content in the normal flow of the document.
		 * - **'draggable'**  \
		 *   The pane is draggable and resizeable, and may be placed anywhere on the page.
		 *
		 *   Note that `<Pane>` is a dynamic component, and availability of additional props will
		 *   vary depending on the defined `mode` value.
		 * */
		mode?: 'draggable' | 'inline' | 'fixed';
	};

	export let mode: 'draggable' | 'inline' | 'fixed' = 'fixed';

	// allow bindings, not included in $$Props type since already explicitly exported
	export let expanded = $$restProps.expanded;
	export let x = $$restProps.x;
	export let y = $$restProps.y;
	export let width = $$restProps.width;

	console.log($$props);

	// {#key} and dynamic <svelte:component approach did not work below
	// TODO maybe strip unexpected props from $$restProps to avoid unknown prop warnings?
</script>

{#if mode === undefined}
	<InternalPaneFixed bind:expanded {x} {y} {width} {...$$restProps}>
		<slot />
	</InternalPaneFixed>
{:else if mode === 'inline'}
	<InternalPaneInline bind:expanded {...$$restProps}>
		<slot />
	</InternalPaneInline>
{:else if mode === 'draggable'}
	<InternalPaneDraggable bind:x bind:y bind:width bind:expanded {...$$restProps}>
		<slot />
	</InternalPaneDraggable>
{/if}
