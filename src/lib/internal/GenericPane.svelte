<script lang="ts">
	import type { Theme } from '../theme.js';
	import { applyTheme } from '../theme.js';
	import type { Container } from '../utils.js';
	// import type { BladeState } from '@tweakpane/core';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { Pane as TpPane } from 'tweakpane';
	import { updateCollapsability, type Plugin } from '../utils.js';
	// import type { BladeState } from '@tweakpane/core';

	/** Text in the pane's title bar. If undefined, no title bar is shown, and expanding / collapsing the pane will only be available through the `expanded` prop. */
	export let title: string | undefined = undefined;

	/** Whether the pane may be collapsed by clicking the title bar. If `false`, programmatic expanding / collapsing remains available through the `expanded` prop. */
	export let clickToExpand: boolean = true;

	/** Expand and collapse the pane into its title bar. Bindable. */
	export let expanded: boolean = true; // special case

	/** Custom color scheme. Applies to all child components. Note that `<Pane position="inline" ...>` squares off rounded corners by default to better integrate with surrounding content. */
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
				// TODO remove this
				console.log(`Already registered plugin ${plugin.id}`);
			} else {
				console.log(`Registering plugin "${plugin.id}"`);
				paneRef?.registerPlugin(plugin);
				pluginsRegistered.push(plugin.id);
				console.log(`Plugins registered: ${pluginsRegistered}`);
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

	$: paneRef && updateCollapsability(clickToExpand, paneRef.element, 'tp-rotv_b', 'tp-rotv_m');
	$: paneRef && title && (paneRef.title = title);
	$: paneRef && applyTheme(paneRef.element, theme);
	$: paneRef && (paneRef.expanded = expanded);
</script>

<!--
@component
This component is for internal use only.

@sourceLink
-->

{#if BROWSER}
	<slot />
{/if}
