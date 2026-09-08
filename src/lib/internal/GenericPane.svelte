<script lang="ts">
	import { BROWSER } from 'esm-env'
	import { getContext, onDestroy, setContext, tick } from 'svelte'
	import { type Writable, writable } from 'svelte/store'
	import { Pane as TpPane } from 'tweakpane'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import { applyTheme, type Theme } from '$lib/theme.js'
	import { type Container, type Plugin, updateCollapsibility } from '$lib/utils.js'

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
		if (tpPane === undefined || newScale <= 0) {
			return
		}

		tpPane.element.style.setProperty('--stui-pane-scale', `${newScale}`)
		// Zoom participates in layout and also applies to descendants in the top layer.
		tpPane.element.style.setProperty('zoom', `${newScale}`)
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
{:else if expanded}
	{#if title === undefined}
		<ClsPad keysAdd={['containerVerticalPadding']} {theme} />
	{:else}
		<ClsPad
			keysAdd={[
				'containerVerticalPadding',
				'containerVerticalPadding',
				'containerVerticalPadding',
				'containerUnitSize',
			]}
			{theme}
		/>
	{/if}
	<slot></slot>
{:else if title === undefined}
	<!-- Nothing renders -->
{:else}
	<ClsPad keysAdd={['containerVerticalPadding', 'containerUnitSize']} {theme} />
{/if}

<style>
	/* Blade labels */
	:global(div.svelte-tweakpane-ui div.tp-lblv_l) {
		overflow: hidden;
		padding-right: var(--cnt-hp);
		text-overflow: ellipsis;
	}

	:global(div.svelte-tweakpane-ui [data-stui-description] > .tp-lblv_l) {
		/* Labels can show help even when Tweakpane disables the control's pointer events. */
		pointer-events: auto;
		white-space: nowrap;
	}

	:global(div.svelte-tweakpane-ui [data-stui-description] > .tp-lblv_l::after) {
		cursor: default;
		content: var(--stui-description-hint, none);
		user-select: none;
		padding-inline-start: 0.35em;
	}

	/* Pane title label */
	:global(div.svelte-tweakpane-ui div.tp-rotv_t) {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* A typed time lets JavaScript read the resolved hover delay, including calc(). */
	@property --stui-description-delay {
		inherits: true;
		initial-value: 500ms;
		syntax: '<time>';
	}

	/* Control descriptions */
	:global(div.svelte-tweakpane-ui .stui-description) {
		--stui-description-gap: max(var(--cnt-usp), 0.55rem);
		pointer-events: none;
		position: fixed;
		inset: auto;
		top: anchor(bottom);
		left: clamp(
			8px,
			calc(var(--stui-description-cursor-x) / var(--stui-pane-scale, 1) - 8px),
			calc(100% - var(--stui-description-width, 0px) - 8px)
		);
		position-anchor: auto;
		position-try-fallbacks: flip-block;
		overflow: visible;
		box-sizing: border-box;
		width: max-content;
		max-width: min(
			var(--stui-description-max-width, 16rem),
			calc(100vw / var(--stui-pane-scale, 1) - 16px)
		);
		margin: var(--stui-description-gap) 0;
		padding: var(--tp-container-vertical-padding, 4px) var(--tp-container-horizontal-padding, 4px);
		border: 0;
		border-radius: var(--bld-br);
		font: inherit;
		line-height: 1.4;
		color: var(--bs-bg);
		text-align: left;
		text-wrap: balance;
		overflow-wrap: anywhere;
		white-space: pre-line;
		visibility: hidden;
		opacity: 0;
		background-color: var(--in-fg);
		box-shadow: 0 2px 4px var(--bs-sh);
	}

	:global(div.svelte-tweakpane-ui .stui-description:popover-open) {
		pointer-events: auto;
		visibility: visible;
		opacity: 1;
	}

	/* Match Tweakpane's value-tooltip caret and keep it inside rounded corners. */
	:global(div.svelte-tweakpane-ui .stui-description::before) {
		content: '';
		position: absolute;
		bottom: 100%;
		left: clamp(4px, var(--stui-description-caret-offset, 8px), calc(100% - 4px));
		box-sizing: border-box;
		width: 4px;
		height: 4px;
		margin-left: -2px;
		border: 2px solid transparent;
		border-bottom-color: var(--in-fg);
	}

	:global(div.svelte-tweakpane-ui .stui-description[data-stui-placement='above']::before) {
		top: 100%;
		bottom: auto;
		border-color: var(--in-fg) transparent transparent;
	}

	/* Bridge the entire gap on either side, including when placement flips. */
	:global(div.svelte-tweakpane-ui .stui-description::after) {
		content: '';
		position: absolute;
		inset: calc(-1 * var(--stui-description-gap)) 0;
	}

	@media (prefers-reduced-motion: no-preference) {
		:global(div.svelte-tweakpane-ui .stui-description) {
			transition:
				opacity var(--stui-description-fade-out-duration, 250ms) ease-out,
				visibility var(--stui-description-fade-out-duration, 250ms) allow-discrete,
				display var(--stui-description-fade-out-duration, 250ms) allow-discrete,
				overlay var(--stui-description-fade-out-duration, 250ms) allow-discrete;
		}

		:global(div.svelte-tweakpane-ui .stui-description:popover-open) {
			transition-duration: var(--stui-description-fade-in-duration, 50ms);
		}

		@starting-style {
			:global(div.svelte-tweakpane-ui .stui-description:popover-open) {
				opacity: 0;
			}
		}
	}
</style>
