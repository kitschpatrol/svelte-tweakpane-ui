<script context="module" lang="ts">
	export type PanePosition = 'draggable' | 'fixed' | 'inline';
</script>

<script lang="ts">
	import InternalPaneDraggable from '$lib/internal/InternalPaneDraggable.svelte';
	import InternalPaneFixed from '$lib/internal/InternalPaneFixed.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';
	import { removeKeys } from '$lib/utils';
	import { BROWSER } from 'esm-env';
	import { type ComponentProps, beforeUpdate } from 'svelte';

	type $$Props = (
		| (ComponentProps<InternalPaneDraggable> & {
				position?: 'draggable' | undefined;
		  })
		| (ComponentProps<InternalPaneFixed> & {
				position: 'fixed';
		  })
		| (Omit<ComponentProps<InternalPaneInline>, 'userCreatedPane'> & {
				position: 'inline';
		  })
	) & {
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
		 *   vary depending on the defined `position` value.
		 * @default `'draggable'`
		 * */
		position?: PanePosition;
	};

	// have to do this for bindings to work...
	// maybe related to https://svelte.dev/repl/aacb7e0b8066497490d3204f8a57491c?version=3.2.2 ?
	export let expanded: $$Props['expanded'] = undefined;
	export let position: $$Props['position'] = undefined;
	export let width: $$Props['width'] = undefined;

	// redeclare types instead of referencing $$Props['key'] since certain keys aren't guaranteed
	export let x: number | undefined = undefined;
	export let y: number | undefined = undefined;

	beforeUpdate(() => {
		// don't let saved draggable props override explicit props in inline and fixed modes
		if ($$props.position === 'inline' || $$props.position === 'fixed') {
			x = $$props.x;
			y = $$props.y;
			width = $$props.width;
			expanded = $$props.expanded;
		}
	});

	// the below proved more reliable than keying on mode and setting <svelte:component this={props.mode} {...$$restProps} />
</script>

<!--
@component
The root `<Pane>` component, used for organizing controls into a single group and controlling how and where the Tweakpane is displayed.

This component is a wrapper around Tweakpane's [Pane](https://tweakpane.github.io/docs/api/classes/Pane.html) class.

See the `position` property for important variations in display behavior.

If `position` is left undefined, `<Pane position='draggable'>` is used by default.

Wrapping components in a `<Pane>` is not mandatory. Pane-less components will be automatically nested in a `<Pane position='inline'>` component and displayed in the regular block flow of the page.

Multiple `<Pane>` components of different modes may be added to a single page. If the panes are in `fixed` or `draggable` mode, you might want to set the `x` or `y` properties to prevent overlap.

Note that `<Pane>` is a dynamic component, and availability of additional props will vary depending on the defined `position` value.

Mode overview:

- **`<Pane position='draggable' ...>`** is an extension of Tweakpane's core functionality, which reasonably considers pane dragging outside of the library's scope. See discussion in Tweakpane issues [#88](https://github.com/cocopon/tweakpane/issues/88) and [#301](https://github.com/cocopon/tweakpane/issues/301).
		
		By default, the pane's last position and width will be saved to the browser's local storage and re-applied across page reloads. (Set the `storePositionLocally` prop to false to prevent this.)
		
		If multiple `<Pane position='draggable' ...>` components are used on the same page with `storePositionLocally` set to true, then each must have a unique `localStoreId` prop set to avoid collisions.
		
		Double-clicking the width drag handle will expand or contract the pane between to its `minWidth` and `maxWidth` sizes.
- **`<Pane position='inline' ...>`** is an inline version of the pane component, allowing the Tweakpane window to appear in the normal flow of the document.
	  
		All other `svelte-tweakpane-ui` components which are created without a containing `<Pane>` are nested implicitly inside a titleless `<Pane position='inline'>` component. As such, you do not necessarily need create `<Pane position='inline'>` components in most cases.
	
		This mode's behavior is similar to creating a Pane in Vanilla JS Tweakpane with its [`container`](https://tweakpane.github.io/docs/misc/#containerElement) property set to its parent element.
- **`<Pane position='fixed' ...>`** exhibits the standard Vanilla JS Tweakpane behavior of displaying in a fixed position over the page.

@example	
```svelte
<script lang="ts">
  import { Button, Pane } from 'svelte-tweakpane-ui';
</script>

<Pane title="Drag Me Around">
  <Button on:click={() => alert('Reticulation complete')} title="Reticulate" />
</Pane>
```

@sourceLink [Pane.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/core/Pane.svelte)
-->

{#if BROWSER}
	{#if position === undefined || position === 'draggable'}
		<InternalPaneDraggable bind:expanded bind:width bind:x bind:y {...$$restProps}>
			<slot />
		</InternalPaneDraggable>
	{:else if position === 'inline'}
		<InternalPaneInline bind:expanded {width} {...removeKeys($$restProps, 'storePositionLocally')}>
			<slot />
		</InternalPaneInline>
	{:else if position === 'fixed'}
		<InternalPaneFixed bind:expanded bind:x bind:y {width} {...$$restProps}>
			<slot />
		</InternalPaneFixed>
	{/if}
{/if}
