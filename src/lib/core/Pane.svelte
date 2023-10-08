<script lang="ts" generics="M extends 'draggable' | 'inline' | 'fixed'">
	import AutoObject from '$lib/extra/AutoObject.svelte';

	import type { ComponentProps } from 'svelte';
	import InternalPaneFixed from '$lib/internal/InternalPaneFixed.svelte';
	import InternalPaneDraggable from '$lib/internal/InternalPaneDraggable.svelte';
	import InternalPaneInline from '$lib/internal/InternalPaneInline.svelte';

	// type utilities
	type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
		k: infer I
	) => void
		? I
		: never;
	type IsUnion<T> = [T] extends [UnionToIntersection<T>] ? false : true;
	type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

	// TODo what about undefined? right now just ignore
	type DefaultToFixedMode<T> = IsUnion<T> extends true ? 'fixed' : T extends undefined ? T : T;

	type GenerateAutocomplete<T> = T extends 'fixed' & 'inline'
		? 'draggable' | 'fixed' | 'inline'
		: T;

	type UndefinedToAutocompletion<T> = T extends undefined ? 'draggable' : T;

	interface PaneDraggableProps extends ComponentProps<InternalPaneDraggable> {
		mode: 'draggable';
	}

	interface PaneInlineProps extends Omit<ComponentProps<InternalPaneInline>, 'userCreatedPane'> {
		mode: 'inline';
	}

	interface PaneFixedProps extends ComponentProps<InternalPaneFixed> {
		mode: 'fixed';
	}

	// some kind of enum wrapper?

	export let mode: M = 'fixed' as M;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Props = Omit<
		(PaneInlineProps | PaneDraggableProps | PaneFixedProps) & {
			mode: DefaultToFixedMode<M>;
		},
		'mode'
	> & {
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
		mode?: DefaultToFixedMode<M>; // TODO how to allow autocomplete without messing up inline?
	};

	type test1 = IsUnion<M>;
	type test2 = UndefinedToFixedMode<undefined>;
	type test3 = UndefinedToFixedMode<'fixed'>;
	type test4 = UndefinedToFixedMode<'draggable'>;
	type test5 = UndefinedToFixedMode<'draggable' | 'inline' | 'fixed' | undefined>;

	// allow bindings, not included in $$Props type since already explicitly exported
	let { expanded, x, y, width } = $$restProps;

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
