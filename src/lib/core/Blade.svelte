<script lang="ts" generics="T extends BaseBladeParams, U extends BladeApi">
	import { BROWSER } from 'esm-env';

	import type { BladeApi, BaseBladeParams } from 'tweakpane';
	import type { Pane as TpPane } from 'tweakpane';
	import { onMount, onDestroy, getContext } from 'svelte';
	import { getElementIndex, isRootPane, stripProps, type TpContainer } from '$lib/utils.js';
	import type { Writable } from 'svelte/store';
	import type { Theme } from '$lib/theme.js';
	import { applyTheme } from '$lib/theme.js';
	import PaneInline from './PaneInline.svelte';

	export let bladeParams: T;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;
	export let bladeRef: U | undefined = undefined;

	const parentStore: Writable<TpContainer> = getContext('parentStore');
	const userCreatedPane = getContext('userCreatedPane');
	// const dispatch = createEventDispatcher();

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
			<svelte:self {...$$props} bind:bladeRef />
		</PaneInline>
	{/if}
{/if}
