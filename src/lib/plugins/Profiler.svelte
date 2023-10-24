<script lang="ts" context="module">
	import type { ProfilerBladeMeasureHandler } from '@0b5vr/tweakpane-plugin-profiler';
	export type ProfilerMeasureHandler = ProfilerBladeMeasureHandler;
	export type ProfilerCalcMode = 'frame' | 'mean' | 'median';
	export type ProfilerMeasure = (name: string, fn: () => void) => void;
</script>

<script lang="ts">
	import Blade from '../core/Blade.svelte';
	import * as pluginModule from '@0b5vr/tweakpane-plugin-profiler';
	import type { ProfilerBladePluginParams as ProfilerOptions } from '@0b5vr/tweakpane-plugin-profiler/dist/types/ProfilerBladePluginParams.js';
	import type { ProfilerBladeApi as ProfilerRef } from '@0b5vr/tweakpane-plugin-profiler/dist/types/ProfilerApi.js';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<
			ComponentProps<Blade<ProfilerOptions, ProfilerRef>>,
			'ref' | 'options' | 'plugin'
		> {
		/** TODO Docs */
		bufferSize?: number;
		/** TODO Docs */
		calcMode?: ProfilerCalcMode;
		/** TODO Docs */
		deltaUnit?: string;
		/** TODO Docs */
		fractionDigits?: number;
		/** TODO Docs */
		measureHandler?: ProfilerMeasureHandler;
		/** TODO Docs */
		targetDelta?: number;
		/** TODO Docs */
		label?: string;
		/** TODO Docs, TODO really vet this */
		measure?: ProfilerMeasure;
	}

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

	$: options = {
		view: 'profiler',
		bufferSize,
		calcMode,
		deltaUnit,
		fractionDigits,
		label,
		measureHandler,
		targetDelta
	} as ProfilerOptions;
</script>

<!--
@component
TODO

Example:
```tsx
TODO
```

@sourceLink
-->

<Blade bind:ref={profilerBlade} {options} plugin={pluginModule} {...$$restProps} />
