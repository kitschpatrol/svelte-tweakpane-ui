<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import type { FpsGraphBladeApi as FpsGraphRef } from '@tweakpane/plugin-essentials';
	import type { FpsGraphBladeParams as FpsGraphOptions } from '@tweakpane/plugin-essentials/dist/types/fps-graph/plugin.js';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

	type $$Props = Omit<
		ComponentProps<Blade<FpsGraphOptions, FpsGraphRef>>,
		'ref' | 'options' | 'plugin'
	> & {
		/**
		 * Height of the FPS graph, in rows.
		 * @default `2`
		 * */
		rows?: number;
		/**
		 * Time in milliseconds between updates to the graph.
		 * @default `1000`
		 * */
		interval?: number;
		/**
		 * Upper bound of the FPS graph.
		 * @default `90`
		 * */
		max?: number;
		/**
		 * Lower bound of the FPS graph.
		 * @default `0`
		 * */
		min?: number;
		/**
		 * Text displayed next to the FPS graph.
		 * @default `undefined`
		 * */
		label?: string;
		/**
		 * Function to start a single frame measurement sample.
		 *
		 * If undefined, a `requestAnimationFrame` is used to indicate the overall performance of the page.
		 * @default `undefined`
		 * */
		begin?: () => void;
		/**
		 * Function to end a single frame measurement sample.
		 *
		 * If undefined, a `requestAnimationFrame` is used to indicate the overall performance of the page.
		 * @default `undefined`
		 * */
		end?: () => void;
	};

	// reexport for bindability
	export let rows: $$Props['rows'] = undefined; // default comes from implementation
	export let interval: $$Props['interval'] = undefined; // default comes from implementation
	export let max: $$Props['max'] = undefined; // default comes from implementation
	export let min: $$Props['min'] = undefined; // default comes from implementation
	export let label: $$Props['label'] = undefined;

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

	let fpsBlade: FpsGraphRef;
	let requestId: number;

	// Seems to be the only way to get event comments to work
	type $$Events = {
		/**
		 * Fires when the FPS value changes

		 * @event
		 * */
		change: number;
	};

	const dispatch = createEventDispatcher<$$Events>();

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

	$: BROWSER && fpsBlade && startObservingMeasuredFpsValue();

	let options: FpsGraphOptions;
	$: BROWSER &&
		(options = {
			view: 'fpsgraph',
			label,
			rows,
			max,
			min,
			interval
		});

	$: BROWSER && !implicitMode && stopInternalLoop();
</script>

<!--
@component
TODO

@emits {number} change - when the FPS value changes

@example
```tsx
<script lang="ts">
  import { TODO } from 'svelte-tweakpane-ui';
  const status = 'TODO';
</script>

<pre>
{status}
</pre>
```

@sourceLink [FpsGraph.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/essentials/FpsGraph.svelte)
-->

{#if BROWSER}
	<Blade bind:ref={fpsBlade} {options} plugin={pluginModule} {...$$restProps} />
{/if}
