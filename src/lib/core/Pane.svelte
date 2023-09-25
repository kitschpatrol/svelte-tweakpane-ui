<script lang="ts">
	import { onMount, onDestroy, setContext, getContext } from 'svelte';
	import { Pane as TpPane } from 'tweakpane';
	import { BROWSER } from 'esm-env';
	import type { Theme } from '$lib/theme.js';
	import { applyTheme } from '$lib/theme.js';

	import * as CamerakitPlugin from '@tweakpane/plugin-camerakit';
	import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
	import * as ImagePlugin from 'tweakpane-image-plugin';
	import * as RotationPlugin from '@0b5vr/tweakpane-plugin-rotation';
	import * as ProfilerPlugin from '@0b5vr/tweakpane-plugin-profiler';
	import * as TextareaPlugin from '@pangenerator/tweakpane-textarea-plugin';
	import * as ThumbnailListPlugin from 'tweakpane-plugin-thumbnail-list';
	import * as WaveformPlugin from 'tweakpane-plugin-waveform';
	import { writable, type Writable } from 'svelte/store';
	import type { TpContainer } from '$lib/utils.js';

	export let title: string | undefined = undefined;
	export let expanded: boolean = true; // special case
	export let theme: Theme | undefined = undefined;
	export let mode: 'inline' | 'floating' | 'draggable' = 'inline';
	export let userCreatedPane = true; // internal use

	let container: HTMLElement;
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

		setContext('parentStore', parentStore);
		setContext('userCreatedPane', userCreatedPane);

		onMount(() => {
			if (mode === 'inline') {
				container.appendChild($parentStore.element);
			}
		});

		onDestroy(() => {
			$parentStore.dispose();
		});
	}

	$: BROWSER && $parentStore && title && ($parentStore.title = title);
	// TODO animation jankiness
	//$: BROWSER && $parentStore && expanded && ($parentStore.expanded = expanded);
	$: BROWSER && $parentStore && applyTheme($parentStore.element, theme);

	// Dragging...
	// const minPanelWidth = 200;
</script>

{#if BROWSER}
	<div class="container" bind:this={container}>
		<slot />
	</div>
{/if}
