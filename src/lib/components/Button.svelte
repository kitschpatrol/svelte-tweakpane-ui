<script lang="ts">
	import type { Pane } from 'tweakpane';
	import type { ButtonApi, FolderApi, TabPageApi, TpEvent } from '@tweakpane/core';
	import { createEventDispatcher, onDestroy, getContext, onMount } from 'svelte';
	import { getElementIndex } from './utils.js';
	import type { Writable } from 'svelte/store';

	export let title: string = 'Button';
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;

	const dispatch = createEventDispatcher();
	const parentStore: Writable<Pane | FolderApi | TabPageApi | undefined> =
		getContext('parentStore');

	let button: ButtonApi;
	let indexElement: HTMLDivElement;
	let index: number;

	onMount(() => {
		index = getElementIndex(indexElement);
	});

	function create() {
		if (!button && $parentStore) {
			button = $parentStore.addButton({
				title,
				label,
				disabled,
				index
			});
			button.on('click', () => {
				// TODO event types?
				// Does TpEvent with its target value make
				// any sense?
				dispatch('click');
			});
		}
	}

	function destroy() {
		button?.dispose();
		button && $parentStore?.remove(button);
	}

	onDestroy(() => {
		destroy();
	});

	$: index !== undefined && $parentStore && create();
	$: button && (button.title = title);
	$: button && (button.label = label);
	$: button && (button.disabled = disabled);
</script>

<div style="display: none;" bind:this={indexElement} />
