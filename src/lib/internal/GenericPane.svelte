<script lang="ts">
	import ClsPad from '#lib/internal/ClsPad.svelte'
	import { applyTheme, type Theme } from '#lib/theme.js'
	import { type Container, type Plugin, updateCollapsibility } from '#lib/utils.js'
	import { BROWSER } from 'esm-env'
	import { getContext, onDestroy, setContext, tick } from 'svelte'
	import { type Writable, writable } from 'svelte/store'
	import { Pane as TpPane } from 'tweakpane'

	// Import type { BladeState } from '@tweakpane/core';

	/**
	 * Text in the pane's title bar.
	 *
	 * If `position="inline"`, the default is `undefined` and no title bar is
	 * shown.
	 *
	 * @default `Tweakpane`
	 */
	export let title: string | undefined = undefined

	/**
	 * Allow users to interactively expand / contract the pane by clicking its
	 * title bar.
	 *
	 * Hides the collapse button from the title bar when `false`.
	 *
	 * @default `true`
	 */
	export let userExpandable: boolean = true

	/**
	 * Expand or collapse the pane into its title bar.
	 *
	 * @default `true`
	 * @bindable
	 */
	export let expanded: boolean = true // Special case

	/**
	 * Custom color scheme.
	 *
	 * Applies to all child components, but note that setting a different `theme`
	 * on a child component's prop will **not** override the parent pane's theme.
	 *
	 * Note that `<Pane position="inline' ...>` squares off rounded corners by
	 * default to better integrate with surrounding content.
	 *
	 * Simply pass a custom or default theme like `ThemeUtils.presets.standard` if
	 * you want rounded corners on an `inline` pane.
	 *
	 * See also the `setGlobalDefaultTheme()` for a way to set a custom default
	 * theme for all panes on the page.
	 *
	 * If undefined, inherits default Tweakpane theme equivalent to
	 * `ThemeUtils.presets.standard`, or the theme set with
	 * `setGlobalDefaultTheme()`.
	 *
	 * @default `undefined`
	 */
	export let theme: Theme | undefined = undefined

	/**
	 * Scales the pane's elements by a factor of `scale` to make it easier to see.
	 *
	 * Holds the width of the pane constant, so the pane will grow taller as it is
	 * scaled and will continue to respect position- and size-related props. If
	 * you need more breathing room, set the `width` property on the pane.
	 *
	 * Note that the scaling prop is only available on `<Pane>`, not on
	 * stand-alone (implicitly wrapped) inline elements.
	 *
	 * Negative values are ignored.
	 *
	 * @default `1`
	 */
	export let scale: number = 1

	// Export let state: BladeState | undefined = undefined;

	// TODO Giant pain to pass through,
	/**
	 * Function to import a state object and set all pane values simultaneously.
	 * Returns true if successful.
	 */
	// export function importState(state: BladeState): boolean { return tpPane?.importState(state)
	//  ?? false;
	// };

	/** Function to export state object of all pane values. */
	// export function exportState(): BladeState | undefined { return tpPane?.exportState();
	// }

	/** Internal use only. */
	export let userCreatedPane = true

	/**
	 * The internal Tweakpane
	 * [`Pane`](https://tweakpane.github.io/docs/api/classes/Pane.html) object.
	 *
	 * This property is exposed for advanced use cases only.
	 *
	 * Direct manipulation of Tweakpane's internals can break _Svelte Tweakpane
	 * UI_ abstractions.
	 *
	 * Note that the `Pane` type for this property comes from the core Tweakpane
	 * library. Creating an alias is suggested to avoid confusion with the _Svelte
	 * Tweakpane UI_ `Pane` component: e.g. `import { type Pane as TpPane } from
	 * 'tweakpane'`
	 *
	 * @bindable
	 * @readonly
	 */
	export let tpPane: TpPane | undefined = undefined

	type $$Slots = {
		/**
		 * Any Tweakpane component, except another `<Pane>`.
		 */
		default: {}
	}

	const parentStore = writable<TpPane>()
	const existingParentStore: Writable<Container | undefined> = getContext('parentStore') // Sanity checks

	// the raw pane.registerPlugin function doesn't seem to prevent duplicate registrations as a
	// minor optimization, we track plugin registrations manually to make sure child components
	// don't redundantly re-register plugins TODO some strategy for plugin removal? not worth it
	// since loading already happened?
	const pluginsRegistered: string[] = []
	const registerPlugin = (plugin: Plugin) => {
		if (tpPane === undefined) {
			console.warn(`tpPane is undefined, failed to register plugin "${plugin.id}"`)
		} else if (!pluginsRegistered.includes(plugin.id)) {
			tpPane?.registerPlugin(plugin)
			pluginsRegistered.push(plugin.id)
		}
	}

	// Allow children to register plugins as needed
	setContext('registerPlugin', registerPlugin)
	setContext('userCreatedPane', userCreatedPane)

	if ($existingParentStore !== undefined) {
		console.warn('<Panes> must not be nested')
	}

	if (BROWSER) {
		$parentStore = new TpPane({ expanded, title })

		// Plugins loaded dynamically at runtime as needed child components are responsible for
		// registration via the registerPlugin context function

		$parentStore.on('fold', () => {
			if ($parentStore.expanded !== undefined && expanded !== $parentStore.expanded) {
				expanded = $parentStore.expanded
			}
		})

		tpPane = $parentStore

		setContext('parentStore', parentStore)

		onDestroy(() => {
			$parentStore.dispose()
		})
	} else {
		// SSR

		setContext('parentStore', writable<boolean>(true))
	}

	function setScale(newScale: number) {
		if (tpPane) {
			if (newScale === 1) {
				tpPane.element.style.removeProperty('transform-origin')
				tpPane.element.style.removeProperty('transform')
				tpPane.element.style.removeProperty('width')
			} else {
				const clampedScale = Math.max(0, newScale)
				tpPane.element.style.transformOrigin = '0 0'
				tpPane.element.style.transform = `scale(${clampedScale})`

				// Jitters a bit, but resizeObserver + rounding wasn't better
				tpPane.element.style.width = `${100 / clampedScale}%`
			}
		}
	}

	function updateExpanded(newExpanded: boolean) {
		void tick().then(() => {
			if (
				newExpanded !== undefined &&
				tpPane?.expanded !== undefined &&
				tpPane.expanded !== newExpanded
			) {
				// eslint-disable-next-line svelte/infinite-reactive-loop
				tpPane.expanded = newExpanded
			}
		})
	}

	$: tpPane?.element?.classList.add('svelte-tweakpane-ui')
	$: tpPane && setScale(scale)
	$: tpPane && updateCollapsibility(userExpandable, tpPane.element, 'tp-rotv_b', 'tp-rotv_m')
	$: tpPane && title !== undefined && (tpPane.title = title.length > 0 ? title : ' ')
	$: tpPane && applyTheme(tpPane.element, theme)
	// eslint-disable-next-line svelte/infinite-reactive-loop
	$: tpPane && updateExpanded(expanded)
</script>

<!--
@component
This component is for internal use only.

@sourceLink
[GenericPane.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericPane.svelte)
-->

{#if BROWSER}
	<slot></slot>
{:else}
	<ClsPad kind="root" {theme} titled={title !== undefined}>
		{#if title !== undefined}
			<ClsPad kind="title" />
		{/if}
		{#if expanded}
			<ClsPad kind="content">
				<slot></slot>
			</ClsPad>
		{/if}
	</ClsPad>
{/if}

<style>
	/* Blade labels */
	:global(div.svelte-tweakpane-ui div.tp-lblv_l) {
		overflow: hidden;
		padding-right: var(--cnt-hp);
		text-overflow: ellipsis;
	}

	/* Pane title label */
	:global(div.svelte-tweakpane-ui div.tp-rotv_t) {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/*
	 * Prerendered skeleton
	 *
	 * These rules lay out the placeholders that ClsPad.svelte renders on the
	 * server, mirroring the layout rules of Tweakpane's stylesheet that decide
	 * a pane's height.
	 *
	 * Everything that depends on a placeholder's position is decided here, by
	 * the browser, from the final HTML. It can't be worked out while rendering,
	 * because Svelte renders parts of a page more than once on the server and
	 * discards all but the last attempt.
	 *
	 * They live here instead of in ClsPad because ClsPad never runs in the
	 * browser, so a bundler may drop its styles as unused, while every pane
	 * runs this component. They are global because they relate placeholders
	 * rendered by different component instances.
	 *
	 * | Skeleton class      | Tweakpane equivalent                  |
	 * | ------------------- | ------------------------------------- |
	 * | `cls-pad-root`      | `tp-rotv`                             |
	 * | `cls-pad-title`     | `tp-rotv_b`, `tp-fldv_b`, `tp-tabv_t` |
	 * | `cls-pad-content`   | `tp-rotv_c`, `tp-fldv_c`, `tp-tbpv_c` |
	 * | `cls-pad-container` | `tp-cntv` (folders and tab groups)    |
	 * | `cls-pad-tab`       | One page of a `tp-tabv`, with its bar |
	 * | `cls-pad-separator` | `tp-sprv`                             |
	 * | `cls-pad-blade`     | Any other blade                       |
	 *
	 * A `cls-pad-spacer` adds the height a control has beyond one blade.
	 */
	:global(.cls-pad-root) {
		--cls-pad-unit-size: var(--tp-container-unit-size, 20px);
		--cls-pad-unit-spacing: var(--tp-container-unit-spacing, 4px);
		--cls-pad-vertical-padding: var(--tp-container-vertical-padding, 4px);

		/* The margin on both sides of a blade, explained with the spacing rules */
		--cls-pad-blade-margin: min(var(--cls-pad-unit-spacing), var(--cls-pad-vertical-padding));
	}

	/* Tweakpane sets its own font size, which theme sizes given in em resolve
	   against. A spacer and an element's separator need it too, since they can
	   sit outside of a root. */
	:global(.cls-pad-root),
	:global(.cls-pad-spacer),
	:global(.cls-pad-separator) {
		font-size: 11px;
	}

	:global(.cls-pad-title) {
		height: calc(var(--cls-pad-unit-size) + 4px);
	}

	/* Folder and tab page content is indented, as are containers nested in it.
	   This keeps placeholders that are sized by their width the right height. */
	:global(.cls-pad-container > .cls-pad-content),
	:global(.cls-pad-tab > .cls-pad-content) {
		padding-left: 4px;
	}

	:global(.cls-pad-container .cls-pad-container) {
		margin-left: 4px;
	}

	/* A tab group shows one page, and which one is only known in the browser, so
	   the first stands in. A group whose content renders no pages is never
	   created at all, so it takes no space. */
	:global(.cls-pad-tab ~ .cls-pad-tab),
	:global(.cls-pad-container:not(:has(*))) {
		display: none;
	}

	/*
	 * Vertical spacing
	 *
	 * Tweakpane decides the space between blades from their order: a unit of
	 * spacing between plain blades, the vertical padding around a separator,
	 * folder or tab group, and the vertical padding at both ends.
	 *
	 * Here every placeholder carries a margin on both sides and adjoining
	 * margins collapse into the larger one, which gives the same result without
	 * a placeholder knowing its neighbors. Margins also collapse through
	 * wrapper elements at any depth and through empty elements, so elements a
	 * page puts around or between a pane's children don't change the result.
	 *
	 * Selectors that do look at a neighbor only cover what collapsing can't
	 * express. They are built from placeholder classes alone, never from
	 * attribute selectors or an unanchored `:has()`, because the browser would
	 * re-check those on every class change anywhere on the page, long after the
	 * placeholders are gone.
	 */

	/* The content establishes the vertical padding as margins of its own, at
	   both ends, for the first and last placeholder's margins to collapse into */
	:global(.cls-pad-content) {
		display: flow-root;
		min-height: calc(2 * var(--cls-pad-vertical-padding));
	}

	:global(.cls-pad-content::before),
	:global(.cls-pad-content::after) {
		content: '';
		display: block;
	}

	:global(.cls-pad-content::before) {
		margin-bottom: var(--cls-pad-vertical-padding);
	}

	:global(.cls-pad-content::after) {
		margin-top: var(--cls-pad-vertical-padding);
	}

	/* A blade's margin is the smaller of the two sizes, so that it never
	   exceeds the padding it collapses into */
	:global(.cls-pad-blade) {
		height: var(--cls-pad-unit-size);
		margin-top: var(--cls-pad-blade-margin);
		margin-bottom: var(--cls-pad-blade-margin);
	}

	/* A spacer extends the blade before it, taking over its bottom margin. It is
	   as wide as a blade's contents, inside the pane's horizontal padding. The
	   two are separate declarations because the first is dropped outside of a
	   root, where its variable is not defined, and the second must stay. */
	:global(.cls-pad-spacer) {
		margin-block: calc(-1 * var(--cls-pad-blade-margin)) var(--cls-pad-blade-margin);
		margin-inline: var(--tp-container-horizontal-padding, 4px);
	}

	/* Its height, which ClsPad sets as a custom property, is applied as padding
	   on a pseudo-element, because a percentage in padding resolves against the
	   width of the containing box. That is what a height taken from the value
	   column's width needs, including a width a theme gives as a percentage. */
	:global(.cls-pad-spacer::before) {
		content: '';
		display: block;
		padding-top: var(--cls-pad-spacer-size);
	}

	/* When the unit spacing is the larger size, neighboring blades need it in full */
	:global(.cls-pad-blade + .cls-pad-blade),
	:global(.cls-pad-spacer + .cls-pad-blade) {
		margin-top: var(--cls-pad-unit-spacing);
	}

	/* An empty separator is as tall as its rule */
	:global(.cls-pad-separator) {
		min-height: 2px;
	}

	:global(.cls-pad-separator),
	:global(.cls-pad-container) {
		margin-top: var(--cls-pad-vertical-padding);
		margin-bottom: var(--cls-pad-vertical-padding);
	}

	/* Two separators in a row touch, as do two folders or tab groups, also
	   across a hidden tab group or an empty element between them */
	:global(.cls-pad-separator + .cls-pad-separator),
	:global(.cls-pad-container:has(*) + .cls-pad-container),
	:global(
		.cls-pad-separator
			+ :is(.cls-pad-container:not(:has(*)), :empty:not(.cls-pad-blade, .cls-pad-separator))
			+ .cls-pad-separator
	),
	:global(
		.cls-pad-container:has(*)
			+ :is(.cls-pad-container:not(:has(*)), :empty:not(.cls-pad-blade, .cls-pad-separator))
			+ .cls-pad-container
	) {
		margin-top: calc(-1 * var(--cls-pad-vertical-padding));
	}

	/* A folder or tab group at the end of its content sits flush with the edge,
	   when nothing but hidden tab groups and empty elements comes after it.
	   The `:has()` lists the siblings that do take up space: blades,
	   separators, folders and tab groups with children, and any other element
	   with content. (Unlike the opposite rule below, it can't name hidden tab
	   groups by their own `:has()`, because `:has()` can't be nested.)

	   Inside wrapper elements, it is only at the end if each wrapper is last
	   too. A selector can't tell a wrapper within the same content from one
	   around an enclosing folder, so this checks up to three wrappers, from
	   the placeholder up to its content. Deeper wrappers are taken to be last. */
	:global(
		.cls-pad-container:not(
			:has(
				~ .cls-pad-blade,
				~ .cls-pad-separator,
				~ .cls-pad-container > *,
				~ :not(:empty, .cls-pad-container)
			),
			:not(.cls-pad-content, :last-child) > *,
			:not(.cls-pad-content, :last-child) > :not(.cls-pad-content) > *,
			:not(.cls-pad-content, :last-child) > :not(.cls-pad-content) > :not(.cls-pad-content) > *
		)
	) {
		margin-bottom: calc(-1 * var(--cls-pad-vertical-padding));
	}

	/* A folder or tab group also sits flush with the top of a pane that has no
	   title bar, when nothing but hidden tab groups and empty elements comes
	   before it. This covers one directly in the pane's content or inside
	   wrapper elements that are each first too, but not one nested in another
	   folder or tab group. Every wrapper around such a placeholder is within
	   the pane's content, so all of them are checked. */
	:global(
		.cls-pad-root:not(.cls-pad-titled)
			> .cls-pad-content
			.cls-pad-container:not(
				.cls-pad-container *,
				:not(.cls-pad-container:not(:has(*)), :empty:not(.cls-pad-blade, .cls-pad-separator)) ~ *,
				.cls-pad-content :not(:first-child) *
			)
	) {
		margin-top: calc(-1 * var(--cls-pad-vertical-padding));
	}
</style>
