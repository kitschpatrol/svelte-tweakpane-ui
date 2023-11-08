<script context="module" lang="ts">
	import type { ProfilerBladeMeasureHandler } from '@kitschpatrol/tweakpane-plugin-profiler';
	import type { Simplify } from '$lib/utils';

	export type ProfilerMeasureHandler = Simplify<ProfilerBladeMeasureHandler>;
	export type ProfilerCalcMode = 'frame' | 'mean' | 'median';
	export type ProfilerMeasure = (name: string, fn: () => void) => void;
</script>

<script lang="ts">
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-profiler';
	import type { ProfilerBladeApi as ProfilerRef } from '@kitschpatrol/tweakpane-plugin-profiler/dist/types/ProfilerApi.js';
	import type { ProfilerBladePluginParams as ProfilerOptions } from '@kitschpatrol/tweakpane-plugin-profiler/dist/types/ProfilerBladePluginParams.js';
	import Blade from '$lib/core/Blade.svelte';
	import { enforceReadonly } from '$lib/utils';
	import { BROWSER, DEV } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<
		ComponentProps<Blade<ProfilerOptions, ProfilerRef>>,
		'options' | 'plugin' | 'ref'
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
		 * Milliseconds between samples.
		 * @todo more docs
		 * @default `500`
		 */
		interval?: number;
		/**
		 * Text displayed next to the profiler graph.
		 * @default `undefined`
		 * */
		label?: string;
		/**
		 * Function handle that wraps another function to measure its execution duration.
		 * @example `measure('Hard Work', () => { ... })`;
		 * @bindable
		 * @readonly
		 * @default `undefined`
		 */
		measure?: ProfilerMeasure;
		/**
		 * Function wrapping the `measure` function.
		 *
		 * The default is fine for most cases.
		 * @default [`new
		 * ProfilerBladeDefaultMeasureHandler()`](https://github.com/kitschpatrol/tweakpane-plugin-profiler/blob/tweakpane-v4/src/ProfilerBladeDefaultMeasureHandler.ts)
		 */
		measureHandler?: ProfilerMeasureHandler;
		/**
		 * TODO Docs
		 * @default `16.67`  \
		 * 60fps.
		 */
		targetDelta?: number;
	};

	// exporting a const function might be cleaner, but less expected by the user?
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
			bufferSize,
			calcMode,
			deltaUnit,
			fractionDigits,
			label,
			measureHandler,
			targetDelta,
			view: 'profiler'
		});
</script>

<!--
@component  
TODO Component documentation...

Integrates [0b5vr's](https://0b5vr.com)
[tweakpane-plugin-profiler](https://github.com/0b5vr/tweakpane-plugin-profiler).

Note that `svelte-tweakpane-ui` embeds a
[fork](https://github.com/kitschpatrol/tweakpane-plugin-profiler) of the plugin with support for
Tweakpane 4. The dependency will be updated to point to the source repository if / when the open
[pull request](https://github.com/0b5vr/tweakpane-plugin-profiler/pull/1) with Tweakpane 4 support
is merged.

Usage outside of a `<Pane>` component will implicitly wrap the profiler in `<Pane
position='inline'>`.

@example  
```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { Profiler, type ProfilerMeasure, Slider } from 'svelte-tweakpane-ui';

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
  bind:value={loopExponent}
  min={1}
  max={5}
  label="Loop Exponent (Careful)"
  step={1}
/>
```

@sourceLink
[Profiler.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/Profiler.svelte)
-->

{#if BROWSER}
	<Blade bind:ref={profilerBlade} {options} plugin={pluginModule} {...$$restProps} />
{/if}
