<script lang="ts" generics="M extends 'draggable' | 'inline' | 'fixed' | undefined">
	import InternalPaneDraggable from '$lib/internal/InternalPaneDraggable.svelte';
	import InternalPaneFixed from '$lib/internal/InternalPaneFixed.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import type { IsUnion } from '$lib/utils.js';
	import type { ComponentProps } from 'svelte';

	type InlineProps = Omit<ComponentProps<InternalPaneInline>, 'userCreatedPane'> & {
		mode: 'inline';
	};

	type FixedProps = ComponentProps<InternalPaneFixed> & {
		mode?: 'fixed' | undefined;
	};

	type DraggableProps = ComponentProps<InternalPaneDraggable> & {
		mode: 'draggable';
	};

	// why is this so painful
	// via https://github.com/sveltejs/svelte/issues/9130
	// https://github.com/microsoft/TypeScript/issues/41759
	// TODO deal with the missing autocomplete info on the mode prop
	// hmm https://github.com/microsoft/TypeScript/issues/41759
	type $$Props = IsUnion<M> extends true
		? FixedProps & {
				mode?: M;
		  }
		: (InlineProps | FixedProps | DraggableProps) & {
				/**
				 * Pane mode, one of three options:
				 * - **'fixed'** *(default)*  \
				 *   Standard TweakPane behavior where the pane is shown in a fixed position on the page.
				 * - **'inline'**  \
				 *   The pane appears inline with other content in the normal flow of the document.
				 * - **'draggable'**  \
				 *   The pane is draggable and resizeable, and may be placed anywhere on the page.
				 *
				 *   🚨 **Due to discriminated union issue I can't seem to solve in TypeScript,
				 *   the `mode` prop does not display correct autocompletions.
				 * 	 Rest assured it can take `fixed` `inline` or `draggable` as values.**
				 *
				 *   Note that `<Pane>` is a dynamic component, and availability of additional props will
				 *   vary depending on the defined `mode` value.
				 * */
				mode: M;
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
