<script lang="ts">
	import type { Theme } from '$lib/theme.js';
	import { applyTheme } from '$lib/theme.js';
	import { isRootPane, type TpContainer } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { Pane as TpPane } from 'tweakpane';

	import * as ProfilerPlugin from '@0b5vr/tweakpane-plugin-profiler';
	import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation';
	import * as TextareaPlugin from '@pangenerator/tweakpane-textarea-plugin';
	import * as CamerakitPlugin from '@tweakpane/plugin-camerakit';
	import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
	import * as ImagePlugin from 'tweakpane-image-plugin';
	import * as ThumbnailListPlugin from 'tweakpane-plugin-thumbnail-list';
	import * as WaveformPlugin from 'tweakpane-plugin-waveform';

	export let title: string | undefined = undefined;
	export let expanded: boolean = true; // special case
	export let theme: Theme | undefined = undefined;
	export let userCreatedPane = true; // internal use
	export let paneRef: TpPane | undefined = undefined;

	const parentStore = writable<TpPane>();
	const existingParentStore: Writable<TpContainer | undefined> = getContext('parentStore'); // sanity checks

	if (BROWSER) {
		if ($existingParentStore !== undefined) {
			console.warn('<Panes> must not be nested');
		}

		$parentStore = new TpPane({ title, expanded });

		// TODO reactive plugins
		$parentStore.registerPlugin(CamerakitPlugin);
		$parentStore.registerPlugin(EssentialsPlugin);
		$parentStore.registerPlugin(ImagePlugin);
		$parentStore.registerPlugin(TextareaPlugin);
		$parentStore.registerPlugin(WaveformPlugin);
		$parentStore.registerPlugin(RotationPlugin);
		$parentStore.registerPlugin(ProfilerPlugin);
		$parentStore.registerPlugin(ThumbnailListPlugin);

		$parentStore.on('fold', () => {
			expanded = $parentStore.expanded;
		});

		paneRef = $parentStore;

		isRootPane($parentStore);

		setContext('parentStore', parentStore);
		setContext('userCreatedPane', userCreatedPane);

		onDestroy(() => {
			$parentStore.dispose();
		});
	}

	$: console.log(`theme inside generic: ${theme}`);

	$: BROWSER && $parentStore && title && ($parentStore.title = title);
	// TODO animation jankiness
	//$: BROWSER && $parentStore && expanded && ($parentStore.expanded = expanded);
	$: BROWSER && $parentStore && applyTheme($parentStore.element, theme);
</script>

{#if BROWSER}
	<slot />
{/if}