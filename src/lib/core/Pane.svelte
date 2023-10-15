<script lang="ts">
	import InternalPaneDraggable from '$lib/internal/InternalPaneDraggable.svelte';
	import InternalPaneFixed from '$lib/internal/InternalPaneFixed.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';

	import type { ComponentProps } from 'svelte';

	// hide userCreatedPane from public API, since it only matters to implicit panes
	type InlineProps = Omit<ComponentProps<InternalPaneInline>, 'userCreatedPane'> & {
		mode: 'inline';
	};

	type FixedProps = ComponentProps<InternalPaneFixed> & {
		mode: 'fixed';
	};

	// optional makes this "default"
	type DraggableProps = ComponentProps<InternalPaneDraggable> & {
		mode?: 'draggable' | undefined;
	};

	// default to draggable, take advantage of the fact that it props are the union
	// of all other modes to work around Typescript default discriminated union autocomplete bugs
	// $$props.mode = $$props.mode ?? 'draggable';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

	// type safety...
	// $: props = $$props as $$Props;
	let { mode, expanded, x, y, width } = $$props;

	// the below proved more reliable than keying on mode and setting <svelte:component this={props.mode} {...$$restProps} />
</script>

<!--
@component
The root `<Pane>` component, used for organizing controls into a single group and controlling how and where the Tweakpane is displayed.

This component is a wrapper around Tweakpane's [Pane](https://tweakpane.github.io/docs/api/classes/Pane.html) class.

See the `mode` property for important variations in display behavior.

If `mode` is left undefined, `<Pane mode='draggable'>` is used by default.

Wrapping components in a `<Pane>` is not mandatory. Pane-less components will be automatically nested in a `<Pane mode='inline'>` component and displayed in the regular block flow of the page.

Multiple `<Pane>` components of different modes may be added to a single page. If the panes are in `fixed` or `draggable` mode, you might want to set the `x` or `y` properties to prevent overlap.

Note that `<Pane>` is a dynamic component, and availability of additional props will vary depending on the defined `mode` value.

Mode overview:

- **`<Pane mode='draggable' ...>`** is an extension of Tweakpane's core functionality, which reasonably considers pane dragging outside of the library's scope. See discussion in Tweakpane issues [#88](https://github.com/cocopon/tweakpane/issues/88) and [#301](https://github.com/cocopon/tweakpane/issues/301).
		
		By default, the pane's last position and width will be saved to the browser's local storage and re-applied across page reloads. (Set the `storePositionLocally` prop to false to prevent this.)
		
		If multiple `<Pane mode='draggable' ...>` components are used on the same page with `storePositionLocally` set to true, then each must have a unique `localStoreId` prop set to avoid collisions.
		
		Double-clicking the width drag handle will expand or contract the pane between to its `minWidth` and `maxWidth` sizes.
- **`<Pane mode='inline' ...>`** is an inline version of the pane component, allowing the Tweakpane window to appear in the normal flow of the document.
	  
		All other `svelte-tweakpane-ui` components which are created without a containing `<Pane>` are nested implicitly inside a titleless `<Pane mode='inline' ...>` component. As such, you do not necessarily need create `<Pane mode='inline' ...>` components in most cases.
	
		This mode's behavior is similar to creating a Pane in Vanilla JS Tweakpane with its [`container`](https://tweakpane.github.io/docs/misc/#containerElement) property set to its parent element.
- **`<Pane mode='fixed' ...>`** exhibits the standard Vanlilla JS Tweakpane behavior of displaying in a fixed position over the page.

Example:	
```tsx
<Pane title="Drag Me Around">
	<Button title="Reticulate" on:click={() => alert('Reticulation complete')} />
</Pane>
```
-->

{#if mode === undefined || mode === 'draggable'}
	<InternalPaneDraggable bind:x bind:y bind:width bind:expanded {...$$restProps}>
		<slot />
	</InternalPaneDraggable>
{:else if mode === 'inline'}
	<InternalPaneInline bind:expanded {...$$restProps}>
		<slot />
	</InternalPaneInline>
{:else if mode === 'fixed'}
	<InternalPaneFixed bind:expanded {...$$restProps}>
		<slot />
	</InternalPaneFixed>
{/if}
