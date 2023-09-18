<script lang="ts">
	import type { Pane } from 'tweakpane';
	import type { ButtonApi, FolderApi, TabPageApi, TpEvent } from '@tweakpane/core';
	import { createEventDispatcher, onDestroy, getContext, onMount } from 'svelte';
	import { getElementIndex } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';

	export let title: string = 'Button';
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;

	let indexElement: HTMLDivElement;
	let button: ButtonApi;
	let index: number;

	const dispatch = createEventDispatcher();
	const parentStore: Writable<Pane | FolderApi | TabPageApi> = getContext('parentStore');

	onMount(() => {
		index = getElementIndex(indexElement);
	});

	function create() {
		button = $parentStore.addButton({
			title,
			label,
			disabled,
			index: getElementIndex(indexElement)
		});

		button.on('click', () => {
			// Event type? Does TpEvent with its target value make any sense?
			dispatch('click');
		});
	}

	onDestroy(() => {
		button?.dispose();
	});

	$: index !== undefined && $parentStore && !button && create();
	$: button && (button.title = title);
	$: button && (button.label = label);
	$: button && (button.disabled = disabled);
</script>

<div style="display: none;" bind:this={indexElement} />
