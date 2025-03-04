<script context="module" lang="ts">
	import type { Simplify } from '$lib/utils'
	import type { ProfilerBladeMeasureHandler } from '@kitschpatrol/tweakpane-plugin-profiler'

	export type ProfilerCalcMode = 'frame' | 'mean' | 'median'
	export type ProfilerMeasure = (name: string, functionToMeasure: () => void) => void
	export type ProfilerMeasureAsync = (
		name: string,
		functionToMeasure: () => Promise<void>,
	) => Promise<void>
	export type ProfilerMeasureHandler = Simplify<ProfilerBladeMeasureHandler>

	// TODO for next breaking change: Inherit from ValueChangeEvent instead
	export type ProfilerChangeEvent = CustomEvent<number>
</script>

<script lang="ts">
	import type { UnwrapCustomEvents } from '$lib/utils'
	import type { ProfilerBladeApi as ProfilerRef } from '@kitschpatrol/tweakpane-plugin-profiler/dist/types/ProfilerBladeApi.js'
	import type { ProfilerBladePluginParams as ProfilerOptions } from '@kitschpatrol/tweakpane-plugin-profiler/dist/types/ProfilerBladePluginParams.js'
	import Blade from '$lib/core/Blade.svelte'
	import ClsPad from '$lib/internal/ClsPad.svelte'
	import { fillWith } from '$lib/utils'
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-profiler'
	import { BROWSER } from 'esm-env'
	import { type ComponentProps, createEventDispatcher, onDestroy } from 'svelte'

	type $$Props = {
		/**
		 * Number of duration samples from which to calculate the delta value when `calcMode` is
		 * `'mean'` or `'median'`.
		 * @default `30`
		 */
		bufferSize?: number
		/**
		 * How to calculate the delta value.
		 *
		 * `'frame'` takes only the latest sample into account, while `'mean'` and `'median'` are
		 * calculated from the samples in the buffer.
		 * @default `'mean'`
		 */
		calcMode?: ProfilerCalcMode
		/**
		 * Label suffix for the delta values shown in the control.
		 *
		 * Possibly useful if you're using a custom `ProfilerBladeDefaultMeasureHandler` and are
		 * measuring something other than time.
		 * @default `'ms'`
		 * */
		deltaUnit?: string
		/**
		 * Precision of the delta values shown in the control.
		 * @default `2`
		 */
		fractionDigits?: number
		/**
		 * Milliseconds between updates to the profiler visualization and delta label text.
		 *
		 * Note that this does not affect the internal sampling rate of the profiler itself, which
		 * is determined by your calls to the bound `measure` function.
		 * @default `500`
		 */
		interval?: number
		/**
		 * Text displayed next to the profiler visualization.
		 * @default `undefined`
		 * */
		label?: string
		/**
		 * Function handle that wraps another function to measure its execution duration.
		 *
		 *  If you want to measure something other than execution duration, customize
		 * `ProfilerBladeDefaultMeasureHandler`.
		 *
		 * @example `measure('Hard Work', () => { ... })`;
		 *
		 * @bindable
		 * @readonly
		 * @default `undefined`
		 */
		measure?: ProfilerMeasure
		/**
		 * Async variation of function handle that wraps another function to measure its execution
		 * duration.
		 *
		 * @example `measureAsync('Hard Work', async () => { ... })`;
		 *
		 * @bindable
		 * @async
		 * @readonly
		 * @default `undefined`
		 */
		measureAsync?: ProfilerMeasureAsync
		/**
		 * Function wrapping the `measure` function.
		 *
		 * The default is fine for most cases when you want to measure a temporal duration.
		 * @default [`new
		 * ProfilerBladeDefaultMeasureHandler()`](https://github.com/kitschpatrol/tweakpane-plugin-profiler/blob/dev/src/ProfilerBladeDefaultMeasureHandler.ts)
		 */
		measureHandler?: ProfilerMeasureHandler
		/**
		 * Determines the horizontal scale and color mapping of the profiler visualization bars.
		 * @default `16.67`  \
		 * 60fps.
		 */
		targetDelta?: number
	} & Omit<ComponentProps<Blade<ProfilerOptions, ProfilerRef>>, 'options' | 'plugin' | 'ref'>

	// Exporting a const function might be cleaner, but less expected by the user?
	function _measure(name: string, functionToMeasure: () => void): void {
		profilerBlade?.measure(name, functionToMeasure)
	}

	async function _measureAsync(
		name: string,
		functionToMeasure: () => Promise<void>,
	): Promise<void> {
		// TODO should be void instead of await?
		await profilerBlade?.measureAsync(name, functionToMeasure)
	}

	// Unique
	export let label: $$Props['label'] = undefined
	export let bufferSize: $$Props['bufferSize'] = undefined
	export let calcMode: $$Props['calcMode'] = undefined
	export let deltaUnit: $$Props['deltaUnit'] = undefined
	export let fractionDigits: $$Props['fractionDigits'] = undefined
	export let measureHandler: $$Props['measureHandler'] = undefined
	export const measure: $$Props['measure'] = _measure
	export const measureAsync: $$Props['measureAsync'] = _measureAsync
	export let interval: $$Props['interval'] = undefined
	export let targetDelta: $$Props['targetDelta'] = undefined

	// $: _measure = measure;

	let profilerBlade: ProfilerRef
	let options: ProfilerOptions

	let observer: MutationObserver | undefined = undefined

	// Seems to be the only way to get event comments to work
	type $$Events = {
		/**
		 * Fires when the overall delta value changes, passing the latest measurement.
		 *
		 * Note that the values described in the `ProfilerChangeEvent` type are available on the
		 * `event.detail` parameter.
		 * @event
		 * */
		change: ProfilerChangeEvent
	}

	const dispatch = createEventDispatcher<UnwrapCustomEvents<$$Events>>()

	onDestroy(() => {
		stopObservingMeasuredValue()
	})

	// Observe and update the measured profiler value from the dom This is is kind of crazy, TBD
	// better way to get this data from the profiler blade
	function startObservingMeasuredValue() {
		// Clean up if needed
		stopObservingMeasuredValue()
		const targetNode = profilerBlade.controller.view.valueElement
		if (!targetNode?.innerHTML) return

		observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'characterData' || mutation.type === 'childList') {
					// Parse float ignore the deltaUnit suffix
					const fpsText = (mutation.target as HTMLElement).textContent
					if (fpsText !== null) {
						const delta = Number.parseFloat(fpsText)
						!Number.isNaN(delta) && dispatch('change', delta)
					}
				}
			}
		})

		observer.observe(targetNode, { characterData: true, childList: true, subtree: true })
	}

	function stopObservingMeasuredValue() {
		if (observer) {
			observer.disconnect()
			observer = undefined
		}
	}

	$: profilerBlade && startObservingMeasuredValue()

	// TODO... getting false alarms on this $: DEV && enforceReadonly(_measure, measure, 'Profiler',
	// 'measure', true); $: DEV && enforceReadonly(_measureAsync, measureAsync, 'Profiler',
	// 'measureAsync', true);

	$: options = {
		bufferSize,
		calcMode,
		deltaUnit,
		fractionDigits,
		interval,
		label,
		measureHandler,
		targetDelta,
		view: 'profiler',
	}
</script>

<!--
@component  

Measure and visualize multiple quantities over time.

Configured to measure a function's execution duration by default, but can be customized to measure
anything.

Integrates [0b5vr's](https://0b5vr.com)
[tweakpane-plugin-profiler](https://github.com/0b5vr/tweakpane-plugin-profiler).

See `<FpsGraph>` for a simpler alternative optimized for framerate visualization.

Usage outside of a `<Pane>` component will implicitly wrap the profiler in `<Pane
position="inline">`.

Note that _Svelte Tweakpane UI_ embeds a functionally identical [fork](https://github.com/kitschpatrol/tweakpane-plugin-profiler) of the plugin with build optimizations.

@example  
```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import {
    Profiler,
    type ProfilerMeasure,
    Slider,
  } from 'svelte-tweakpane-ui'

  // This is a readonly function handle assigned by Profiler component
  // first used in onMount since it is not bound until then
  let measure: ProfilerMeasure

  let loopExponent = 1

  // Helper to test Math functions
  function hardWork(
    function_: (n: number) => number,
    exponent: number,
  ): void {
    measure(function_.name, () => {
      for (let sum = 0; sum < Number('1e' + exponent); sum++) {
        function_(sum)
      }
    })
  }

  onMount(() => {
    let animationFrameHandle: number

    // Nesting measurements creates a hierarchy
    // in the Profile visualization
    function tick() {
      measure('Tick', () => {
        measure('Trigonometry', () => {
          hardWork(Math.sin, loopExponent)
          hardWork(Math.cos, loopExponent)
          hardWork(Math.tan, loopExponent)
          hardWork(Math.atan, loopExponent)
          hardWork(Math.acos, loopExponent)
          hardWork(Math.acosh, loopExponent)
        })
        measure('Logarithms', () => {
          hardWork(Math.log, loopExponent)
          hardWork(Math.log10, loopExponent)
          hardWork(Math.log1p, loopExponent)
          hardWork(Math.log2, loopExponent)
        })
        measure('Rounding', () => {
          hardWork(Math.round, loopExponent)
          hardWork(Math.floor, loopExponent)
          hardWork(Math.ceil, loopExponent)
          hardWork(Math.fround, loopExponent)
        })
      })

      animationFrameHandle = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(animationFrameHandle)
    }
  })
</script>

<Profiler bind:measure label="Profiler" />
<Slider
  bind:value={loopExponent}
  min={1}
  max={5}
  label="Loop Exponent (Careful)"
  step={1}
/>
```

@sourceLink
[Profiler.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/monitor/Profiler.svelte)
-->

<Blade bind:ref={profilerBlade} {options} plugin={pluginModule} {...$$restProps} />
{#if !BROWSER}
	<ClsPad keysAdd={fillWith('containerUnitSize', 2)} theme={$$props.theme} />
	<!-- TODO Magic number for label... -->
	<ClsPad extra={14.287} keysAdd={fillWith('containerVerticalPadding', 1)} theme={$$props.theme} />
{/if}
