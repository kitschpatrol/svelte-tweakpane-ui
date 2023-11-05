<script lang="ts" context="module">
	import type { Simplify } from '$lib/utils';

	import type { ProfilerBladeMeasureHandler } from '@kitschpatrol/tweakpane-plugin-profiler';

	export type ProfilerMeasureHandler = Simplify<ProfilerBladeMeasureHandler>;
	export type ProfilerCalcMode = 'frame' | 'mean' | 'median';
	export type ProfilerMeasure = (name: string, fn: () => void) => void;
</script>

<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import { enforceReadonly } from '$lib/utils';
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-profiler';
	import type { ProfilerBladeApi as ProfilerRef } from '@kitschpatrol/tweakpane-plugin-profiler/dist/types/ProfilerApi.js';
	import type { ProfilerBladePluginParams as ProfilerOptions } from '@kitschpatrol/tweakpane-plugin-profiler/dist/types/ProfilerBladePluginParams.js';
	import { BROWSER, DEV } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<
		ComponentProps<Blade<ProfilerOptions, ProfilerRef>>,
		'ref' | 'options' | 'plugin'
	> & {
		/**
		 * TODO Docs
		 * @default `30`
		 */
		bufferSize?: number;
		/**
		 * TODO Docs
		 * @default `'mean'`
		 */
		calcMode?: ProfilerCalcMode;
		/**
		 * TODO Docs
		 * @default `'ms'`
		 * */
		deltaUnit?: string;
		/**
		 * TODO Docs
		 * @default `2`
		 */
		fractionDigits?: number;
		/**
		 * Function wrapping the `measure` function.
		 *
		 * The default is fine for most cases.
		 * @default [`new ProfilerBladeDefaultMeasureHandler()`](https://github.com/kitschpatrol/tweakpane-plugin-profiler/blob/tweakpane-v4/src/ProfilerBladeDefaultMeasureHandler.ts)
		 */
		measureHandler?: ProfilerMeasureHandler;
		/**
		 * TODO Docs
		 * @default `16.67` (60fps)
		 */
		targetDelta?: number;
		/**
		 * Text displayed next to the profiler graph.
		 * @default `undefined`
		 * */
		label?: string;
		/**
		 * Function handle that wraps another function to measure its execution duration.
		 * @example `measure('Hard Work', () => { ... })`);
		 * @bindable
		 * @readonly
		 * @default `undefined`
		 */
		measure?: ProfilerMeasure;
		/**
		 * Milliseconds between samples.
		 * @todo more docs
		 * @default `500`
		 */
		interval?: number;
	};

	// exporting a const function might be cleaner, but
	// less expected by the user?
	function _measure(name: string, fn: () => void): void {
		profilerBlade?.measure(name, fn);
	}

	//unique
	export let label: $$Props['label'] = undefined;
	export let bufferSize: $$Props['bufferSize'] = undefined;
	export let calcMode: $$Props['calcMode'] = undefined;
	export let deltaUnit: $$Props['deltaUnit'] = undefined;
	export let fractionDigits: $$Props['fractionDigits'] = undefined;
	export let measureHandler: $$Props['measureHandler'] = undefined;
	export let measure: $$Props['measure'] = _measure;
	export let targetDelta: $$Props['targetDelta'] = undefined;

	// $: measure = _measure;

	let profilerBlade: ProfilerRef;
	let options: ProfilerOptions;

	$: DEV && BROWSER && enforceReadonly(_measure, measure, 'Profiler', 'measure');

	$: BROWSER &&
		(options = {
			view: 'profiler',
			bufferSize,
			calcMode,
			deltaUnit,
			fractionDigits,
			label,
			measureHandler,
			targetDelta
		});
</script>

<!--
@component
TODO

@example
```svelte
<script lang="ts">
  import { Profiler, Slider, type ProfilerMeasure } from 'svelte-tweakpane-ui';
  import { onMount } from 'svelte';

  // this is a readonly function handle assigned by Profiler component
  // first used in onMount since it is not bound until then
  let measure: ProfilerMeasure;

  let loopExponent = 1;

  // helper to test Math functions
  function hardWork(fn: (n: number) => number, exponent: number): void {
    measure(fn.name, () => {
      for (let sum = 0; sum < Number('1e' + exponent); sum++) {
        fn(sum);
      }
    });
  }

  onMount(() => {
    (function tick() {
      // Nesting measurements creates a hierarchy
      // in the Profile visualization
      measure('Tick', () => {
        measure('Trigonometry', () => {
          hardWork(Math.sin, loopExponent);
          hardWork(Math.cos, loopExponent);
          hardWork(Math.tan, loopExponent);
          hardWork(Math.atan, loopExponent);
          hardWork(Math.acos, loopExponent);
          hardWork(Math.acosh, loopExponent);
        });
        measure('Logarithms', () => {
          hardWork(Math.log, loopExponent);
          hardWork(Math.log10, loopExponent);
          hardWork(Math.log1p, loopExponent);
          hardWork(Math.log2, loopExponent);
        });
        measure('Rounding', () => {
          hardWork(Math.round, loopExponent);
          hardWork(Math.floor, loopExponent);
          hardWork(Math.ceil, loopExponent);
          hardWork(Math.fround, loopExponent);
        });
      });

      requestAnimationFrame(tick);
    })();
  });
</script>

<Profiler bind:measure label="Profiler" />
<Slider
  label="Loop Exponent (Careful)"
  bind:value={loopExponent}
  min={1}
  max={5}
  step={1}
/>
```

@sourceLink [Profiler.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/Profiler.svelte)
-->

{#if BROWSER}
	<Blade bind:ref={profilerBlade} {options} plugin={pluginModule} {...$$restProps} />
{/if}
