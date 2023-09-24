<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';
	import type { Pane } from 'tweakpane';
	import { writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { BROWSER } from 'esm-env';
	import { createPane } from '$lib/utils.js';
	import type { Theme } from '$lib/theme.js';
	import { applyTheme } from '$lib/theme.js';

	export let title: string | undefined = undefined;
	export let expanded: boolean = true; // special case
	export let theme: Theme | undefined = undefined;

	let paneStore: Writable<Pane>;
	let container: HTMLElement;

	// TODO reactive plugins
	// TODO theme presets
	// TODO draggable
	if (BROWSER) {
		paneStore = writable<Pane>(createPane({ title, expanded }, true));
		setContext('parentStore', paneStore);

		// flag so stand-alone components can know if they're in an explicit pane
		// if not, they will create a containing pane themselves
		setContext<boolean>('inPane', true);

		$paneStore.on('fold', () => {
			expanded = $paneStore.expanded;
		});

		onMount(() => {
			container.appendChild($paneStore.element);
		});

		onDestroy(() => {
			$paneStore.dispose();
		});
	}

	$: if ($paneStore) $paneStore.title = title;
	$: if ($paneStore) $paneStore.expanded = expanded;
	$: if ($paneStore) applyTheme($paneStore.element, theme);
</script>

<div class="container" bind:this={container}>
	<slot />
</div>
