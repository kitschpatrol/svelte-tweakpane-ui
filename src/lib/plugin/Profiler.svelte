<script lang="ts">
	import Blade from '../core/Blade.svelte';
	import type { ProfilerBladeMeasureHandler } from '@0b5vr/tweakpane-plugin-profiler';
	import type { ProfilerBladePluginParams } from '@0b5vr/tweakpane-plugin-profiler/dist/types/ProfilerBladePluginParams.js';
	import type { ProfilerBladeApi } from '@0b5vr/tweakpane-plugin-profiler/dist/types/ProfilerApi.js';
	import type { ComponentProps } from 'svelte';

	interface $$Props
		extends Omit<
			ComponentProps<Blade<ProfilerBladePluginParams, ProfilerBladeApi>>,
			'bladeref' | 'bladeParams' | 'plugin'
		> {
		/** TODO Docs */
		bufferSize?: number;
		/** TODO Docs */
		calcMode?: 'frame' | 'mean' | 'median';
		/** TODO Docs */
		deltaUnit?: string;
		/** TODO Docs */
		fractionDigits?: number;
		/** TODO Docs */
		measureHandler?: ProfilerBladeMeasureHandler;
		/** TODO Docs */
		targetDelta?: number;
		/** TODO Docs */
		label?: string;
		/** TODO Docs, TODO really vet this */
		measure?: (name: string, fn: () => void) => void;
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

	let profilerBlade: ProfilerBladeApi;

	$: bladeParams = {
		view: 'profiler',
		bufferSize,
		calcMode,
		deltaUnit,
		fractionDigits,
		label,
		measureHandler,
		targetDelta
	};
</script>

<!--
@component
TODO

Example:
```tsx
TODO
```
-->

{#await import('@0b5vr/tweakpane-plugin-profiler') then module}
	<Blade bind:bladeRef={profilerBlade} {bladeParams} plugin={module} {...$$restProps} />
{/await}
