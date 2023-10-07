<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import Pane from '$lib/core/Pane.svelte';
	import PaneDraggable from '$lib/core/PaneDraggable.svelte';
	import PaneInline from '$lib/core/PaneInline.svelte';

	interface PaneDraggableProps extends ComponentProps<PaneDraggable> {
		mode: 'draggable';
	}

	interface PaneInlineProps extends Omit<ComponentProps<PaneInline>, 'userCreatedPane'> {
		mode: 'inline';
	}

	interface PaneProps extends ComponentProps<Pane> {
		mode: 'fixed';
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = (PaneDraggableProps | PaneInlineProps | PaneProps) & {
		/** Pick a mode */
		mode: 'fixed' | 'draggable' | 'inline';
	};

	/** mode help */
	export let mode = $$props.mode ?? 'fixed';

	// allow binding, not included in $$Props type since already explicitly exported
	export let expanded = $$restProps.expanded;
	export let x = $$restProps.x;
	export let y = $$restProps.y;
	export let width = $$restProps.width;
</script>

{#if mode === 'fixed'}
	<Pane bind:expanded {...$$restProps}>
		<slot />
	</Pane>
{:else if mode === 'inline'}
	<PaneInline bind:expanded {...$$restProps}>
		<slot />
	</PaneInline>
{:else}
	<PaneDraggable bind:x bind:y bind:width bind:expanded {...$$restProps}>
		<slot />
	</PaneDraggable>
{/if}
