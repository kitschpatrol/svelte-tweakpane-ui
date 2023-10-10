<script lang="ts">
	import InternalPaneDraggable from '$lib/internal/InternalPaneDraggable.svelte';
	import InternalPaneFixed from '$lib/internal/InternalPaneFixed.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';

	import type { ComponentProps } from 'svelte';

	type InlineProps = Omit<ComponentProps<InternalPaneInline>, 'userCreatedPane'> & {
		mode: 'inline';
	};

	type FixedProps = ComponentProps<InternalPaneFixed> & {
		mode: 'fixed';
	};

	type DraggableProps = ComponentProps<InternalPaneDraggable> & {
		mode?: 'draggable';
	};

	// default to draggable, take advantage of the fact that it props are the union
	// of all other modes to work around Typescript default discriminated union autocomplete bugs
	$$props.mode = $$props.mode ?? 'draggable';

	type $$Props = (InlineProps | FixedProps | DraggableProps) & {
		/**
		 * Pane mode, one of three options:
		 * - **'draggable'** *(default)*  \
		 *   The pane is draggable and resizeable, and may be placed anywhere over the page.
		 * - **'inline'**  \
		 *   The pane appears inline with other content in the normal flow of the document.  \
		 *   *This is the default mode for components created outside of an explicit `<Pane>` component.*
		 * - **'fixed'** \
		 *   Standard TweakPane behavior where the pane is shown in a fixed position over the page.
		 *
		 *   Note that `<Pane>` is a dynamic component, and availability of additional props will
		 *   vary depending on the defined `mode` value.
		 * */
		mode?: 'inline' | 'fixed' | 'draggable';
	};

	// TODO check this for binding bugs
	$: props = $$props as $$Props;

	let { expanded, x, y, width } = $$props;

	// the below proved more reliable than <svelte:component this={props.mode} {...$$restProps} />
</script>

{#if props.mode === undefined}
	<InternalPaneFixed bind:expanded {x} {y} {width} {...$$restProps}>
		<slot />
	</InternalPaneFixed>
{:else if props.mode === 'inline'}
	<InternalPaneInline bind:expanded {...$$restProps}>
		<slot />
	</InternalPaneInline>
{:else if props.mode === 'draggable'}
	<InternalPaneDraggable bind:x bind:y bind:width bind:expanded {...$$restProps}>
		<slot />
	</InternalPaneDraggable>
{/if}
