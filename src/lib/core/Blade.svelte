<script lang="ts" generics="T extends BaseBladeParams, U extends BladeApi">
	import type { BladeApi, BaseBladeParams } from 'tweakpane';
	import type { Pane } from 'tweakpane';
	import type { FolderApi, TabPageApi } from '@tweakpane/core';
	import { onMount, onDestroy, getContext } from 'svelte';
	import { createPane, getElementIndex } from '$lib/utils.js';
	import { writable, type Writable } from 'svelte/store';
	import type { Theme } from '$lib/theme.js';
	import { applyTheme } from '$lib/theme.js';

	export let bladeParams: T;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;

	const parentStore: Writable<Pane | FolderApi | TabPageApi> =
		getContext('parentStore') ?? writable();
	const inPane = getContext('inPane');
	// const dispatch = createEventDispatcher();

	// dangerous but allows access when needed (e.g. fps essentials plugin)
	export let bladeRef: U | undefined = undefined;

	let indexElement: HTMLDivElement;
	let blade: U;
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
			index,
			...bladeParams,
			disabled
		}) as U; // TODO hmm
		bladeRef = blade;
	}

	onDestroy(() => {
		blade?.dispose();
		!inPane && $parentStore?.dispose();
	});

	$: bladeParams, $parentStore && index !== undefined && create();
	$: blade && (blade.disabled = disabled);
	$: if ($parentStore && !inPane) applyTheme($parentStore.element, theme);
	$: if ($parentStore && inPane && theme)
		console.warn('Set theme on the <Pane> component, not on its children!');
</script>

<div style="display: none;" bind:this={indexElement} />
