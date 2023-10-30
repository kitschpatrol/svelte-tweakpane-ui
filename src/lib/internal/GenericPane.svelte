<script lang="ts">
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { Pane as TpPane } from 'tweakpane';
	import type { Theme } from '$lib/theme.js';
	import { applyTheme } from '$lib/theme.js';
	import type { Container } from '$lib/utils.js';
	import { updateCollapsability, type Plugin } from '$lib/utils.js';
	// import type { BladeState } from '@tweakpane/core';

	/**
	 * Text in the pane's title bar.
	 * @default `Tweakpane` (Unless `position="inline"`, in which case the default is `undefined` and no title bar is shown.)
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
	 * Applies to all child components, but note that setting a different `theme` on a child component's prop will **not** override the parent pane's theme.
	 *
	 * Note that `<Pane position="inline" ...>` squares off rounded corners by default to better integrate with surrounding content.
	 *
	 * Simply pass a custom or default theme like `THEMES.standard` if you want rounded corners on an `inline` pane.
	 *
	 * See also the `setGlobalDefaultTheme()` for a way to set a custom default theme for all panes on the page.
	 * @default `undefined` (Inherits default Tweakpane theme equivalent to `THEMES.standard`, or the theme set with `setGlobalDefaultTheme()`.)
	 * */
	export let theme: Theme | undefined = undefined;

	// export let state: BladeState | undefined = undefined;

	// TODO Giant pain to pass through,
	/** Function to import a state object and set all pane values simultaneously. Returns true if successful. */
	// export function importState(state: BladeState): boolean {
	// 	return paneRef?.importState(state) ?? false;
	// };

	/** Function to export state object of all pane values. */
	// export function exportState(): BladeState | undefined {
	// 	return paneRef?.exportState();
	// }

	/** Internal use only. */
	export let userCreatedPane = true;

	/** Internal use only. */
	export let paneRef: TpPane | undefined = undefined;

	const parentStore = writable<TpPane>();
	const existingParentStore: Writable<Container | undefined> = getContext('parentStore'); // sanity checks

	// the raw pane.registerPlugin function doesn't seem to prevent duplicate registrations
	// as a minor optimization, we track plugin registrations manually to make sure child components
	// don't redundantly re-register plugins
	// TODO some strategy for plugin removal? not worth it since loading already happened?
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

	if (BROWSER) {
		if ($existingParentStore !== undefined) {
			console.warn('<Panes> must not be nested');
		}

		$parentStore = new TpPane({ title, expanded });

		// plugins loaded dynamically at runtime as needed
		// child components are responsible for registration via the
		// registerPlugin context function

		$parentStore.on('fold', () => {
			expanded = $parentStore.expanded;
		});

		paneRef = $parentStore;

		setContext('parentStore', parentStore);
		setContext('userCreatedPane', userCreatedPane);

		onDestroy(() => {
			$parentStore.dispose();
		});
	}

	$: BROWSER &&
		paneRef &&
		updateCollapsability(clickToExpand, paneRef.element, 'tp-rotv_b', 'tp-rotv_m');
	$: BROWSER && paneRef && title && (paneRef.title = title);
	$: BROWSER && paneRef && applyTheme(paneRef.element, theme);
	$: BROWSER && paneRef && (paneRef.expanded = expanded);
</script>

<!--
@component
This component is for internal use only.

@sourceLink
-->

{#if BROWSER}
	<slot />
{/if}
