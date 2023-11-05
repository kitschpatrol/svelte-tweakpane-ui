<script lang="ts" context="module">
	export type FpsGraphChangeEvent = CustomEvent<number>;
</script>

<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import type { UnwrapCustomEvents } from '$lib/utils.js';
	import type { FpsGraphBladeApi as FpsGraphRef } from '@tweakpane/plugin-essentials';
	import type { FpsGraphBladeParams as FpsGraphOptions } from '@tweakpane/plugin-essentials/dist/types/fps-graph/plugin.js';
	import { onDestroy, onMount, createEventDispatcher } from 'svelte';
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
		 * Fires when the FPS value changes, passing the latest FPS measurement.
		 *
		 * Note that the values described in the `FpsGraphChangeEvent`
		 * type are available on the `event.detail` parameter.
		 * @event
		 * */
		change: FpsGraphChangeEvent;
	};

	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>();

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
```svelte
<script lang="ts">
  import { FpsGraph, Slider, Monitor } from 'svelte-tweakpane-ui';
  import { BROWSER } from 'esm-env';

  let rotation = 0;
  let rotationSpeed = 3;
  let phase = 500;
  let scale = 1.25;
  let intensity = 4;

  if (BROWSER) {
    (function tick() {
      rotation += rotationSpeed;
      requestAnimationFrame(tick);
    })();
  }

  $: gridSize = intensity ** 2;
</script>

<FpsGraph rows={5} interval={50} />

<Slider label="Intensity" bind:value={intensity} step={1} min={1} max={10} />
<Monitor label="Boxes" value={gridSize ** 2} format={(v) => v.toFixed(0)} />
<Slider label="Scale" bind:value={scale} min={0.25} max={2} />
<Slider label="Phase" bind:value={phase} min={0} max={2000} />
<Slider label="Rotation Speed" bind:value={rotationSpeed} />

<div class="demo">
  {#each Array.from({ length: gridSize }, (_, i) => i) as x}
    {#each Array.from({ length: gridSize }, (_, i) => i) as y}
      <div
        class="box"
        style:left="{(x / gridSize) * 100}%"
        style:top="{(y / gridSize) * 100}%"
        style:width="{100 / gridSize}%"
        style:transform="rotateZ({rotation +
          (x / gridSize) * phase +
          (y / gridSize) * phase}deg)"
        style:scale
      />
    {/each}
  {/each}
</div>

<style>
  .demo {
    width: 100%;
    aspect-ratio: 1;
    background: linear-gradient(to top, gold, rebeccapurple);
    overflow: hidden;
    position: relative;
  }

  .box {
    position: absolute;
    aspect-ratio: 1;
    background: linear-gradient(to bottom, orange, magenta);
    opacity: 0.5;
    transform-origin: center;
  }
</style>
```

@sourceLink [FpsGraph.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/essentials/FpsGraph.svelte)
-->

{#if BROWSER}
	<Blade bind:ref={fpsBlade} {options} plugin={pluginModule} {...$$restProps} />
{/if}
