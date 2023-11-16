<script lang="ts">
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import { type Theme, applyTheme } from '$lib/theme.js';
	import type { Container } from '$lib/utils.js';
	import { type Plugin, updateCollapsibility } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, setContext } from 'svelte';
	import { type Writable, writable } from 'svelte/store';
	import { Pane as TpPane } from 'tweakpane';

	// import type { BladeState } from '@tweakpane/core';

	/**
	 * Text in the pane's title bar.
	 * @default `Tweakpane`  \
	 * Unless `position='inline'`, in which case the default is `undefined` and no title bar is
	 * shown.
	 * */
	export let title: string | undefined = undefined;

	/**
	 * Allow users to interactively expand / contract the pane by clicking its title bar.
	 *
	 * Hides the collapse button from the title bar when `false`.
	 * @default `true`
	 * */
	export let clickToExpand: boolean = true;

	/**
	 * Expand or collapse the pane into its title bar.
	 * @default `true`
	 * @bindable
	 * */
	export let expanded: boolean = true; // special case

	/**
	 * Custom color scheme.
	 *
	 * Applies to all child components, but note that setting a different `theme` on a child
	 * component's prop will **not** override the parent pane's theme.
	 *
	 * Note that `<Pane position="inline' ...>` squares off rounded corners by default to better
	 * integrate with surrounding content.
	 *
	 * Simply pass a custom or default theme like `ThemeUtils.presets.standard` if you want rounded
	 * corners on an `inline` pane.
	 *
	 * See also the `setGlobalDefaultTheme()` for a way to set a custom default theme for all panes
	 * on the page.
	 * @default `undefined`  \
	 * Inherits default Tweakpane theme equivalent to `ThemeUtils.presets.standard`, or the theme
	 * set with `setGlobalDefaultTheme()`.
	 * */
	export let theme: Theme | undefined = undefined;

	/**
	 * Scales the pane's elements by a factor of `scale` to make it easier to see.
	 *
	 * Holds the width of the pane constant, so the pane will grow taller as it is scaled and will
	 * continue to respect position- and size-related props. If you need more breathing room, set
	 * the `width` property on the pane.
	 *
	 * Note that the scaling prop is only available on `<Pane>`, not on stand-alone (implicitly
	 * wrapped) inline elements.
	 *
	 * Negative values are ignored.
	 * @default `1`
	 */
	export let scale: number = 1;

	// export let state: BladeState | undefined = undefined;

	// TODO Giant pain to pass through,
	/** Function to import a state object and set all pane values simultaneously. Returns true if
	 * successful. */
	// export function importState(state: BladeState): boolean { return paneRef?.importState(state)
	//  ?? false;
	// };

	/** Function to export state object of all pane values. */
	// export function exportState(): BladeState | undefined { return paneRef?.exportState();
	// }

	/** Internal use only. */
	export let userCreatedPane = true;

	/**
	 * Internal use only.
	 * @readonly
	 * */
	export let paneRef: TpPane | undefined = undefined;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type $$Slots = {
		/**
		 * Any Tweakpane component, except another `<Pane>`.
		 */
		default: {};
	};

	const parentStore = writable<TpPane>();
	const existingParentStore: Writable<Container | undefined> = getContext('parentStore'); // sanity checks

	// the raw pane.registerPlugin function doesn't seem to prevent duplicate registrations as a
	// minor optimization, we track plugin registrations manually to make sure child components
	// don't redundantly re-register plugins TODO some strategy for plugin removal? not worth it
	// since loading already happened?
	let pluginsRegistered: string[] = [];
	const registerPlugin = (plugin: Plugin) => {
		if (paneRef === undefined) {
			console.warn('`paneRef is undefined, failed to register plugin "${plugin.id}"');
		} else {
			if (pluginsRegistered.includes(plugin.id)) {
				// console.log(`Already registered plugin ${plugin.id}`);
			} else {
				// console.log(`Registering plugin "${plugin.id}"`);
				paneRef?.registerPlugin(plugin);
				pluginsRegistered.push(plugin.id);
				// console.log(`Plugins registered: ${pluginsRegistered}`);
			}
		}
	};

	// allow children to register plugins as needed
	setContext('registerPlugin', registerPlugin);
	setContext('userCreatedPane', userCreatedPane);

	if ($existingParentStore !== undefined) {
		console.warn('<Panes> must not be nested');
	}

	if (BROWSER) {
		$parentStore = new TpPane({ expanded, title });

		// plugins loaded dynamically at runtime as needed child components are responsible for
		// registration via the registerPlugin context function

		$parentStore.on('fold', () => {
			expanded = $parentStore.expanded;
		});

		paneRef = $parentStore;

		setContext('parentStore', parentStore);

		onDestroy(() => {
			$parentStore.dispose();
		});
	} else {
		// SSR
		setContext('parentStore', writable<boolean>(true));
	}

	function setScale(scale: number) {
		if (paneRef) {
			if (scale === 1) {
				paneRef.element.style.removeProperty('transform-origin');
				paneRef.element.style.removeProperty('transform');
				paneRef.element.style.removeProperty('width');
			} else {
				const clampedScale = Math.max(0, scale);
				paneRef.element.style.transformOrigin = '0 0';
				paneRef.element.style.transform = `scale(${clampedScale})`;

				// jitters a bit, but resizeObserver + rounding wasn't better
				paneRef.element.style.width = `${100 / clampedScale}%`;
			}
		}
	}

	$: BROWSER && paneRef && setScale(scale);

	$: BROWSER &&
		paneRef &&
		updateCollapsibility(clickToExpand, paneRef.element, 'tp-rotv_b', 'tp-rotv_m');
	$: BROWSER && paneRef && title && (paneRef.title = title);
	$: BROWSER && paneRef && applyTheme(paneRef.element, theme);
	$: BROWSER && paneRef && expanded !== undefined && (paneRef.expanded = expanded);
</script>

<!--
@component  
This component is for internal use only.

@sourceLink
[GenericPane.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/internal/GenericPane.svelte)
-->

{#if BROWSER}
	<slot />
{:else}
	{#if title !== undefined}
		<ClsPad keysAdd={['containerVerticalPadding', 'containerUnitSize']} {theme} />
	{/if}
	{#if expanded}
		<ClsPad keysAdd={['containerVerticalPadding']} {theme} />
		<slot />
	{/if}
{/if}
