<script context="module" lang="ts">
	export type FpsGraphChangeEvent = CustomEvent<number>;
</script>

<script lang="ts">
	import type { FpsGraphBladeApi as FpsGraphRef } from '@tweakpane/plugin-essentials';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import type { FpsGraphBladeParams as FpsGraphOptions } from '@tweakpane/plugin-essentials/dist/types/fps-graph/plugin.js';
	import Blade from '$lib/core/Blade.svelte';
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import { fillWith } from '$lib/utils';
	import type { UnwrapCustomEvents } from '$lib/utils.js';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

	type $$Props = Omit<
		ComponentProps<Blade<FpsGraphOptions, FpsGraphRef>>,
		'options' | 'plugin' | 'ref'
	> & {
		/**
		 * Lower bound of the FPS graph.
		 * @default `0`
		 * */
		min?: number;
		/**
		 * Upper bound of the FPS graph.
		 * @default `90`
		 * */
		max?: number;
		/**
		 * Function to start a single frame measurement sample.
		 *
		 * If undefined, a `requestAnimationFrame` is used to indicate the overall performance of
		 * the page.
		 * @default `undefined`
		 * */
		begin?: () => void;
		/**
		 * Function to end a single frame measurement sample.
		 *
		 * If undefined, a `requestAnimationFrame` is used to indicate the overall performance of
		 * the page.
		 * @default `undefined`
		 * */
		end?: () => void;
		/**
		 * Time in milliseconds between updates to the graph.
		 * @default `1000`
		 * */
		interval?: number;
		/**
		 * Text displayed next to the FPS graph.
		 * @default `undefined`
		 * */
		label?: string;
		/**
		 * Height of the FPS graph, in rows.
		 * @default `2`
		 * */
		rows?: number;
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
		 * Note that the values described in the `FpsGraphChangeEvent` type are available on the
		 * `event.detail` parameter.
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

	// observe and update the measured fps value from the dom This is is kind of crazy, TBD better
	// way to get this data from the fps blade
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

		observer.observe(targetNode, { characterData: true, childList: true, subtree: true });
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
		min,
		max,
		interval,
		label,
		rows,
		view: 'fpsgraph'
	};

	$: !implicitMode && stopInternalLoop();
</script>

<!--
@component  
A control for monitoring and graphing frame rates over time.

Integrates the [FPS Graph](https://github.com/tweakpane/plugin-essentials#fps-graph) control from
Tweakpane-creator [Hiroki Kokubun's](https://cocopon.me)  [Essentials
plugin](https://github.com/tweakpane/plugin-essentials).

By default, the component creates an internal `requestAnimationFrame` loop to measure the overall
performance of the page. If you want to measure the performance of a specific block of code, you can
bind the `begin` and `end` props for access to functions to fence the code of interest. (The default
internal loop will be cleaned up automatically on the bound functions first use.)

See the `<Profiler>` component for a more advanced measurement and visualization strategies.

If you'd like to observe or visualize the frame rate data elsewhere, a `change` event is provided to
notify when the FPS value changes.

@emits {number} change - When the FPS value changes.

Usage outside of a `<Pane>` component will implicitly wrap the FPS graph in `<Pane
position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { FpsGraph, Monitor, Slider } from 'svelte-tweakpane-ui';

  let rotation = 0;
  let rotationSpeed = 3;
  let phase = 500;
  let scale = 1.25;
  let intensity = 4;

  onMount(() => {
    (function tick() {
      rotation += rotationSpeed;
      requestAnimationFrame(tick);
    })();
  });

  $: gridSize = intensity ** 2;
</script>

<FpsGraph interval={50} label="FPS" rows={5} />
<Slider
  bind:value={intensity}
  min={1}
  max={10}
  label="Intensity (Careful)"
  step={1}
/>
<Monitor
  value={gridSize ** 2}
  format={(v) => v.toFixed(0)}
  label="Boxes (Monitor)"
/>
<Slider bind:value={scale} min={0.25} max={2} label="Scale" />
<Slider bind:value={phase} min={0} max={2000} label="Phase" />
<Slider bind:value={rotationSpeed} label="Rotation Speed" />

<div class="demo">
  {#each Array.from({ length: gridSize }, (_, i) => i) as x}
    {#each Array.from({ length: gridSize }, (_, i) => i) as y}
      <div
        class="box"
        style:left="{(x / gridSize) * 100}%"
        style:scale
        style:top="{(y / gridSize) * 100}%"
        style:transform="rotateZ({rotation +
          (x / gridSize) * phase +
          (y / gridSize) * phase}deg)"
        style:width="{100 / gridSize}%"
      />
    {/each}
  {/each}
</div>

<style>
  .demo {
    position: relative;
    overflow: hidden;
    aspect-ratio: 1;
    width: 100%;
    background: linear-gradient(to top, gold, rebeccapurple);
  }

  .box {
    position: absolute;
    transform-origin: center;
    aspect-ratio: 1;
    opacity: 0.5;
    background: linear-gradient(to bottom, orange, magenta);
  }
</style>
```

@sourceLink
[FpsGraph.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/monitor/FpsGraph.svelte)
-->

<Blade bind:ref={fpsBlade} {options} plugin={pluginModule} {...$$restProps} />
{#if !BROWSER}
	{#if rows}
		<ClsPad keysAdd={fillWith('containerUnitSize', rows)} theme={$$props.theme} />
	{:else}
		<ClsPad keysAdd={fillWith('containerUnitSize', 2)} theme={$$props.theme} />
	{/if}
{/if}
