<script lang="ts">
	import Blade from '../../core/Blade.svelte';
	import type { FpsGraphBladeApi as FpsGraphRef } from '@tweakpane/plugin-essentials';
	import type { FpsGraphBladeParams as FpsGraphOptions } from '@tweakpane/plugin-essentials/dist/types/fps-graph/plugin.js';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<
			ComponentProps<Blade<FpsGraphOptions, FpsGraphRef>>,
			'ref' | 'options' | 'plugin'
		> {
		/** TODO Docs */
		rows?: number;
		/** TODO Docs */
		interval?: number;
		/** TODO Docs */
		max?: number;
		/** TODO Docs */
		min?: number;
		/** TODO Docs */
		label?: string;
	}

	export let rows: $$Props['rows'] = 2;
	export let interval: $$Props['interval'] = undefined;
	export let max: $$Props['max'] = undefined;
	export let min: $$Props['min'] = undefined;
	export let label: $$Props['label'] = undefined;

	let implicitMode = true; // false as soon as the external api has been used

	// Begin and end can be bound and called externally for explicit timing
	/** TODO Docs */
	export function begin(): void {
		implicitMode = false;
		fpsBlade?.begin();
	}

	/** TODO Docs */
	export function end(): void {
		implicitMode = false;
		fpsBlade?.end();
	}

	let fpsBlade: FpsGraphRef;
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

	let options: FpsGraphOptions;
	$: options = {
		view: 'fpsgraph',
		label,
		rows,
		max,
		min,
		interval
	} as FpsGraphOptions;

	$: if (!implicitMode) stopInternalLoop();
</script>

<!--
@component
TODO

Example:
```tsx
TODO
```
-->

{#await import('@tweakpane/plugin-essentials') then module}
	<Blade bind:ref={fpsBlade} {options} plugin={module} {...$$restProps} />
{/await}
