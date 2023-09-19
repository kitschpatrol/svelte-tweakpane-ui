<script lang="ts">
	import type { BladeApi, SeparatorBladeParams } from 'tweakpane';
	import type { FpsGraphBladeParams } from '@tweakpane/plugin-essentials/dist/types/fps-graph/plugin.js';
	import type { FpsGraphBladeApi } from '@tweakpane/plugin-essentials';
	import type { Pane } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext, createEventDispatcher } from 'svelte';
	import { createPane, getElementIndex } from '$lib/utils.js';
	import { writable, type Writable } from 'svelte/store';

	// TODO templatize types
	// Slider, list, and text not supported... use Binding or extras
	export let params: SeparatorBladeParams | FpsGraphBladeParams;
	export let disabled: boolean = false;

	const parentStore: Writable<Pane | FolderApi | TabPageApi> =
		getContext('parentStore') ?? writable();
	const inPane = getContext('inPane');
	// const dispatch = createEventDispatcher();

	// dangerous bindable for special cases like fps
	export let bladeRef: BladeApi | FpsGraphBladeApi | undefined = undefined;

	let indexElement: HTMLDivElement;
	let blade: BladeApi | FpsGraphBladeApi;
	let index: number;

	onMount(() => {
		index = getElementIndex(indexElement);

		if (!inPane) {
			$parentStore = createPane({ expanded: true }, true);
			indexElement.replaceWith($parentStore.element);
		}
	});

	function create() {
		// must destroy to allow a reactive parameters
		if (blade) blade.dispose();

		// last one wins
		blade = $parentStore.addBlade({
			...{ index },
			...params,
			...{ disabled }
		});
		bladeRef = blade;
	}

	onDestroy(() => {
		blade?.dispose();
		!inPane && $parentStore?.dispose();
	});

	$: params, $parentStore && index !== undefined && create();
	$: blade && (blade.disabled = disabled);
</script>

<div style="display: none;" bind:this={indexElement} />
