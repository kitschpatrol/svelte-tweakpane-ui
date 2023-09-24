<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import type { FpsGraphBladeApi } from '@tweakpane/plugin-essentials';
	import type { FpsGraphBladeParams } from '@tweakpane/plugin-essentials/dist/types/fps-graph/plugin.js';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';
	import type { Theme } from '$lib/theme.js';

	// re-exported
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let theme: Theme | undefined = undefined;

	//unique
	export let rows: number = 2;
	export let interval: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let min: number | undefined = undefined;

	let implicitMode = true; // false as soon as the external api has been used

	// Begin and end can be bound and called externally for explicit timing
	export function begin(): void {
		implicitMode = false;
		fpsBlade?.begin();
	}

	export function end(): void {
		implicitMode = false;
		fpsBlade?.end();
	}

	let fpsBlade: FpsGraphBladeApi;
	let requestId: number;

	// handle this as an event and not a bound value
	// because it's "read only"
	const dispatch = createEventDispatcher<{ change: number }>();

	onMount(() => {
		startInternalLoop();
	});

	onDestroy(() => {
		stopInternalLoop();
		stopObservingMeasuredFpsValue();
	});

	function startInternalLoop() {
		loop();
	}

	function loop() {
		fpsBlade?.end();
		fpsBlade?.begin();
		requestId = requestAnimationFrame(loop);
	}

	function stopInternalLoop() {
		requestId && cancelAnimationFrame(requestId);
	}

	let observer: MutationObserver | undefined = undefined;

	// observe and update the measured fps value
	// reading from the dom is kind of crazy, TBD better way to get this data from the
	// fps blade
	function startObservingMeasuredFpsValue() {
		// clean up if needed
		stopObservingMeasuredFpsValue();
		const targetNode = fpsBlade.controller.valueController.view.valueElement;
		if (!targetNode || !targetNode.innerHTML) return;

		observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'characterData' || mutation.type === 'childList') {
					const fps = parseInt((mutation.target as HTMLElement).innerText);
					!isNaN(fps) && dispatch('change', fps);
				}
			}
		});

		// Start observing
		observer.observe(targetNode, { childList: true, characterData: true, subtree: true });
	}

	function stopObservingMeasuredFpsValue() {
		if (observer) {
			observer.disconnect();
			observer = undefined;
		}
	}

	$: fpsBlade && startObservingMeasuredFpsValue();

	let bladeParams: FpsGraphBladeParams;
	$: bladeParams = {
		view: 'fpsgraph',
		label,
		rows,
		max,
		min,
		interval
	};

	$: if (!implicitMode) stopInternalLoop();
</script>

<Blade {disabled} bind:bladeRef={fpsBlade} {bladeParams} {theme} />
