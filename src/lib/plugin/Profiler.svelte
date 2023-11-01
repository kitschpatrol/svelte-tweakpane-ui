<script lang="ts" context="module">
	import type { ProfilerBladeMeasureHandler } from '@0b5vr/tweakpane-plugin-profiler';
	export type ProfilerMeasureHandler = ProfilerBladeMeasureHandler;
	export type ProfilerCalcMode = 'frame' | 'mean' | 'median';
	export type ProfilerMeasure = (name: string, fn: () => void) => void;
</script>

<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import * as pluginModule from '@0b5vr/tweakpane-plugin-profiler';
	import type { ProfilerBladePluginParams as ProfilerOptions } from '@0b5vr/tweakpane-plugin-profiler/dist/types/ProfilerBladePluginParams.js';
	import type { ProfilerBladeApi as ProfilerRef } from '@0b5vr/tweakpane-plugin-profiler/dist/types/ProfilerApi.js';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';

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
		 * The defauly is fine for most cases.
		 * @default `[new ProfilerBladeDefaultMeasureHandler()](https://github.com/kitschpatrol/tweakpane-plugin-profiler/blob/tweakpane-v4/src/ProfilerBladeDefaultMeasureHandler.ts)`
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
		 * Function wrapping another function to measure its execution duration.
		 * @example `() => ( 'haha', () => { somethingExpensive(); } );
		 * @todo vet example
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

	// special case function export
	export function measure(name: string, fn: () => void): void {
		profilerBlade?.measure(name, fn);
	}

	//unique
	export let label: $$Props['label'] = undefined;
	export let bufferSize: $$Props['bufferSize'] = undefined;
	export let calcMode: $$Props['calcMode'] = undefined;
	export let deltaUnit: $$Props['deltaUnit'] = undefined;
	export let fractionDigits: $$Props['fractionDigits'] = undefined;
	export let measureHandler: $$Props['measureHandler'] = undefined;
	export let targetDelta: $$Props['targetDelta'] = undefined;

	let profilerBlade: ProfilerRef;
	let options: ProfilerOptions;

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
```tsx
<script lang="ts">
  import { TODO } from 'svelte-tweakpane-ui';
  const status = 'TODO';
</script>

<pre>
{status}
</pre>
```

@sourceLink [Profiler.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/Profiler.svelte)
-->

{#if BROWSER}
	<Blade bind:ref={profilerBlade} {options} plugin={pluginModule} {...$$restProps} />
{/if}
