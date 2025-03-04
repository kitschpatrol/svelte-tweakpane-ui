<script context="module" lang="ts">
	// TODO for next breaking change: Inherit from ValueChangeEvent instead
	export type FpsGraphChangeEvent = CustomEvent<number>
</script>

<script lang="ts">
	import type { UnwrapCustomEvents } from '$lib/utils.js'
	import type { FpsGraphBladeApi as FpsGraphRef } from '@kitschpatrol/tweakpane-plugin-essentials'
	import type { FpsGraphBladeParams as FpsGraphOptions } from '@kitschpatrol/tweakpane-plugin-essentials/dist/types/fps-graph/plugin.js'
	import type { ComponentProps } from 'svelte'
	import Blade from '$lib/core/Blade.svelte'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import { fillWith } from '$lib/utils'
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-essentials'
	import { BROWSER } from 'esm-env'
	import { createEventDispatcher, onDestroy, onMount } from 'svelte'

	type $$Props = {
		/**
		 * Lower bound of the FPS graph.
		 * @default `0`
		 * */
		min?: number
		/**
		 * Upper bound of the FPS graph.
		 * @default `90`
		 * */
		max?: number
		/**
		 * Function to start a single frame measurement sample.
		 *
		 * If undefined, a `requestAnimationFrame` is used to indicate the overall performance of
		 * the page.
		 * @default `undefined`
		 * */
		begin?: () => void
		/**
		 * Function to end a single frame measurement sample.
		 *
		 * If undefined, a `requestAnimationFrame` is used to indicate the overall performance of
		 * the page.
		 * @default `undefined`
		 * */
		end?: () => void
		/**
		 * Time in milliseconds between updates to the graph.
		 * @default `1000`
		 * */
		interval?: number
		/**
		 * Text displayed next to the FPS graph.
		 * @default `undefined`
		 * */
		label?: string
		/**
		 * Height of the FPS graph, in rows.
		 * @default `2`
		 * */
		rows?: number
	} & Omit<ComponentProps<Blade<FpsGraphOptions, FpsGraphRef>>, 'options' | 'plugin' | 'ref'>

	// Reexport for bindability
	export let rows: $$Props['rows'] = undefined // Default comes from implementation
	export let interval: $$Props['interval'] = undefined // Default comes from implementation
	export let max: $$Props['max'] = undefined // Default comes from implementation
	export let min: $$Props['min'] = undefined // Default comes from implementation
	export let label: $$Props['label'] = undefined

	let implicitMode = true // False as soon as the external api has been used

	// Begin and end can be bound and called externally for explicit timing
	export function begin(): void {
		implicitMode = false
		ref?.begin()
	}

	export function end(): void {
		implicitMode = false
		ref?.end()
	}

	let ref: FpsGraphRef
	let requestId: number

	// Seems to be the only way to get event comments to work
	type $$Events = {
		/**
		 * Fires when the FPS value changes, passing the latest FPS measurement.
		 *
		 * Note that the values described in the `FpsGraphChangeEvent` type are available on the
		 * `event.detail` parameter.
		 * @event
		 * */
		change: FpsGraphChangeEvent
	}

	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>()

	onMount(() => {
		startInternalLoop()
	})

	onDestroy(() => {
		stopInternalLoop()
	})

	function startInternalLoop() {
		loop()
	}

	function loop() {
		ref?.end()
		ref?.begin()
		requestId = requestAnimationFrame(loop)
	}

	function stopInternalLoop() {
		requestId && cancelAnimationFrame(requestId)
	}

	function addListeners() {
		ref.on('tick', () => {
			if (ref.fps !== null) {
				dispatch('change', ref.fps)
			}
		})
	}

	let options: FpsGraphOptions
	$: options = {
		min,
		max,
		interval,
		label,
		rows,
		view: 'fpsgraph',
	}
	$: ref !== undefined && addListeners()
	$: !implicitMode && stopInternalLoop()
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

Usage outside of a `<Pane>` component will implicitly wrap the FPS graph in `<Pane
position="inline">`.

Note that _Svelte Tweakpane UI_ embeds a functionally identical [fork](https://github.com/kitschpatrol/tweakpane-plugin-essentials) of the plugin with build optimizations. The fork also changes the package name from `@tweakpane/plugin-essentials` to `@kitschpatrol/tweakpane-plugin-essentials` for consistency with other plugins.

@emits {number} change - When the FPS value changes.

@example  
```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import { FpsGraph, Monitor, Slider } from 'svelte-tweakpane-ui'

  let rotation = 0
  let rotationSpeed = 3
  let phase = 500
  let scale = 1.25
  let intensity = 4

  onMount(() => {
    let animationFrameHandle: number

    function tick() {
      rotation += rotationSpeed
      animationFrameHandle = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(animationFrameHandle)
    }
  })

  $: gridSize = intensity ** 2
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
  {#each Array.from({ length: gridSize }, (_, index) => index) as x}
    {#each Array.from({ length: gridSize }, (_, index) => index) as y}
      <div
        class="box"
        style:left="{(x / gridSize) * 100}%"
        style:scale
        style:top="{(y / gridSize) * 100}%"
        style:transform="rotateZ({rotation +
          (x / gridSize) * phase +
          (y / gridSize) * phase}deg)"
        style:width="{100 / gridSize}%"
      ></div>
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

<Blade bind:ref {options} plugin={pluginModule} {...$$restProps} />
{#if !BROWSER}
	{#if rows}
		<ClsPad keysAdd={fillWith('containerUnitSize', rows)} theme={$$props.theme} />
	{:else}
		<ClsPad keysAdd={fillWith('containerUnitSize', 2)} theme={$$props.theme} />
	{/if}
{/if}
