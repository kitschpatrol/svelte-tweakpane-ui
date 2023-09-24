<script lang="ts">
	import type { Pane as TpPane } from 'tweakpane';
	import type { ButtonApi, FolderApi, TabPageApi, TpEvent } from '@tweakpane/core';
	import { createEventDispatcher, onDestroy, getContext, onMount } from 'svelte';
	import { getElementIndex } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import type { Theme } from '$lib/theme.js';
	import { applyTheme } from '$lib/theme.js';
	import Pane from './Pane.svelte';

	export let title: string = 'Button';
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;

	let indexElement: HTMLDivElement;
	let button: ButtonApi;
	let index: number;
	let paneRef: TpPane;

	const parentStore: Writable<TpPane | FolderApi | TabPageApi> =
		getContext('parentStore') ?? writable();
	const inPane = getContext('inPane');
	const dispatch = createEventDispatcher<{ click: null }>();

	onMount(() => {
		index = getElementIndex(indexElement);
	});

	function create() {
		button = $parentStore.addButton({
			title,
			label,
			disabled,
			index: index
		});

		button.on('click', () => {
			// Event type? Does TpEvent with its target value make any sense?
			dispatch('click');
		});
	}

	onDestroy(() => {
		button?.dispose();
	});

	$: if (index !== undefined && $parentStore && !button) create();
	$: if (button !== undefined) button.title = title;
	$: if (button !== undefined) button.label = label;
	$: if (button !== undefined) button.disabled = disabled;
	$: if ($parentStore !== undefined && !inPane) applyTheme($parentStore.element, theme);
	$: if ($parentStore !== undefined && inPane && theme)
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Button> components for a theme prop.)'
		);
	$: if (paneRef !== undefined) {
		$parentStore = paneRef;
	}
</script>

{#if !inPane}
	<Pane bind:paneRef>
		<div style="display: none;" bind:this={indexElement} />
	</Pane>
{:else}
	<div style="display: none;" bind:this={indexElement} />
{/if}
