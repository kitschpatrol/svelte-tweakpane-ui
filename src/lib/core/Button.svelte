<script lang="ts">
	import type { Pane as TpPane } from 'tweakpane';
	import type { ButtonApi, FolderApi, TabPageApi, TpEvent } from '@tweakpane/core';
	import { createEventDispatcher, onDestroy, getContext, onMount } from 'svelte';
	import { getElementIndex, isRootPane, type TpContainer } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';
	import { writable } from 'svelte/store';
	import type { Theme } from '$lib/theme.js';
	import { applyTheme } from '$lib/theme.js';
	import PaneInline from './PaneInline.svelte';
	import { BROWSER } from 'esm-env';

	export let title: string = 'Button';
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;

	const parentStore: Writable<TpContainer> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');
	const dispatch = createEventDispatcher<{ click: null }>();

	let indexElement: HTMLDivElement;
	let button: ButtonApi;
	let index: number;
	let paneRef: TpPane;

	function create() {
		if (button) button.dispose();

		button = $parentStore.addButton({
			title,
			label,
			disabled,
			index
		});

		button.on('click', () => {
			// Event type? Does TpEvent with its target value make any sense?
			// note that this event must be forwarded manually...
			dispatch('click');
		});
	}

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		button?.dispose();
	});

	$: BROWSER && index !== undefined && $parentStore && !button && create();
	$: BROWSER && button && (button.title = title);
	$: BROWSER && button && (button.label = label);
	$: BROWSER && button && (button.disabled = disabled);
	$: BROWSER &&
		theme &&
		$parentStore &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Button> components for a theme prop.)'
		);
</script>

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement} />
	{:else}
		<PaneInline userCreatedPane={false} {theme}>
			<svelte:self on:click {...$$props} />
		</PaneInline>
	{/if}
{/if}
