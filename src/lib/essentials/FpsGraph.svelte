<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import type { FpsGraphBladeApi } from '@tweakpane/plugin-essentials';
	import type { FpsGraphBladeParams } from '@tweakpane/plugin-essentials/dist/types/fps-graph/plugin.js';
	import { onMount, onDestroy, createEventDispatcher } from 'svelte';

	// re-exported
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;

	//unique
	export let rows: number = 2;
	export let interval: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let min: number | undefined = undefined;

	// Begin and end can be bound and called externally for explicit timing
	// TODO expose as functions on the component instead?
	export const begin = () => {
		fpsBlade && fpsBlade.begin();
	};

	export const end: () => void = () => {
		fpsBlade && fpsBlade.end();
	};

	let fpsBlade: FpsGraphBladeApi;
	let mounted: boolean = false;
	let requestId: number;

	const dispatch = createEventDispatcher<{ change: number }>();

	onMount(() => {
		mounted = true;
	});

	onDestroy(() => {
		stopInternalLoop();
		stopObservingMeasuredFpsValue();
	});

	function startInternalLoop() {
		loop();
	}

	function loop() {
		end();
		begin();
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

	// if begin and end are not bound, then we run a clock internally at the browser frame rate
	$: {
		if (mounted) {
			if ($$props.begin || $$props.end) {
				stopInternalLoop();
			} else {
				startInternalLoop();
			}
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
</script>

<Blade {disabled} bind:bladeRef={fpsBlade} {bladeParams} />
