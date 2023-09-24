<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';
	import { Pane as TpPane } from 'tweakpane';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
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

	export let title: string | undefined = undefined;
	export let expanded: boolean = true; // special case
	export let theme: Theme | undefined = undefined;
	export let mode: 'inline' | 'floating' | 'draggable' = 'inline';

	setContext('indexStore', writable(0));

	let paneStore: Writable<TpPane>;
	let container: HTMLElement;
	export let paneRef: TpPane | undefined = undefined;

	// TODO reactive plugins
	if (BROWSER) {
		const tpPane = new TpPane({ title, expanded });
		tpPane.registerPlugin(CamerakitPlugin);
		tpPane.registerPlugin(EssentialsPlugin);
		tpPane.registerPlugin(ImagePlugin);
		tpPane.registerPlugin(TextareaPlugin);
		tpPane.registerPlugin(WaveformPlugin);
		tpPane.registerPlugin(RotationPlugin);
		tpPane.registerPlugin(ProfilerPlugin);
		tpPane.registerPlugin(ThumbnailListPlugin);

		paneStore = writable<TpPane>(tpPane);
		paneRef = $paneStore;

		// this only runs if the <Pane> has children, allows
		// folders to bootstrap themselves
		// TODO better way...
		if ($$props.$$scope.ctx[0] !== undefined) {
			setContext('parentStore', paneStore);
		}

		// flag so stand-alone components can know if they're in an explicit pane
		// if not, they will create a containing pane themselves
		setContext<boolean>('inPane', true);

		$paneStore.on('fold', () => {
			expanded = $paneStore.expanded;
		});

		onMount(() => {
			if (mode === 'inline') {
				container.appendChild($paneStore.element);
			}
		});

		onDestroy(() => {
			$paneStore.dispose();
		});
	}

	$: if ($paneStore) $paneStore.title = title;
	$: if ($paneStore) $paneStore.expanded = expanded;
	$: if ($paneStore) applyTheme($paneStore.element, theme);

	// Dragging...
	const minPanelWidth = 200;
</script>

<div class="container" bind:this={container}>
	<slot />
</div>
