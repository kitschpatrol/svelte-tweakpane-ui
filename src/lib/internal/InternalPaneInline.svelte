<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import GenericPane from '$lib/internal/GenericPane.svelte';
	import { removeKeys } from '$lib/utils.js';
	import { onMount } from 'svelte';

	type $$Props = {
		/**
		 * Width of the pane, in pixels.
		 *
		 * If undefined, the pane will fill the width of its container. (This behavior is unique to
		 * `position="inline"`.)
		 *
		 * This value is particularly important in combination with `scale`, since a scaled inline
		 * pane will grow indefinitely wider if an intrinsic width is not specified and a containing
		 * element is not provided.
		 * @default `undefined`
		 * */
		width?: number;
	} & ComponentProps<GenericPane>;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Slots = {
		/**
		 * Any Tweakpane component, except another `<Pane>`.
		 */
		default: {};
	};

	// Reexport for bindability
	export let expanded: $$Props['expanded'] = undefined;
	export let width: $$Props['width'] = undefined;
	export let tpPane: $$Props['tpPane'] = undefined;

	// Override theme defaults
	export let theme: $$Props['theme'] = {
		baseBorderRadius: '0px',
		baseShadowColor: 'hsla(0, 0%, 0%, 0)'
		// BladeBorderRadius: '0px'
	};

	let containerElement: HTMLDivElement;

	onMount(() => {
		if (tpPane) {
			const fixedContainer = tpPane.element.parentElement;
			containerElement.append(tpPane.element);
			fixedContainer?.remove();
		} else {
			console.warn('tpPane is undefined');
		}
	});
</script>

<!--
@component  
This component is for internal use only.

@sourceLink
[InternalPaneInline.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/InternalPaneInline.svelte)
-->

<div bind:this={containerElement} style:width={width === undefined ? null : `${width}px`}>
	<GenericPane bind:expanded bind:tpPane {theme} {...removeKeys($$restProps, 'position')}>
		<slot />
	</GenericPane>
</div>
