<script lang="ts" generics="T extends BaseBladeParams, U extends BladeApi">
	import type { Theme } from '$lib/theme.js';
	import { getElementIndex, isRootPane, stripProps, type TpContainer } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import { getContext, onDestroy, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import PaneInline from '$lib/core/PaneInline.svelte';
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { BaseBladeParams, BladeApi } from 'tweakpane';

	export let bladeParams: T;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;
	export let bladeRef: U | undefined = undefined;

	const parentStore: Writable<TpContainer> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');

	let indexElement: HTMLDivElement;
	let blade: U;
	let index: number;

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

	onMount(() => {
		index = indexElement ? getElementIndex(indexElement) : 0;
	});

	onDestroy(() => {
		blade?.dispose();
	});

	$: bladeParams, BROWSER && $parentStore && index !== undefined && create();
	$: BROWSER && blade && (blade.disabled = disabled);
	$: BROWSER &&
		theme &&
		$parentStore &&
		(userCreatedPane || !isRootPane($parentStore)) &&
		console.warn(
			'Set theme on the <Pane> component, not on its children! (Check nested <Blade> components for a theme prop.)'
		);

	// TODO bind blade params too?
	const plainProps = stripProps($$props, 'bladeRef');
</script>

{#if BROWSER}
	{#if parentStore}
		<div style="display: none;" bind:this={indexElement} />
	{:else}
		<PaneInline userCreatedPane={false} {theme}>
			<svelte:self {...plainProps} bind:bladeRef />
		</PaneInline>
	{/if}
{/if}
