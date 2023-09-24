<script lang="ts">
	import Blade from '$lib/core/Blade.svelte';
	import type { ProfilerBladeMeasureHandler } from '@0b5vr/tweakpane-plugin-profiler';
	import type { ProfilerBladeApi } from '@0b5vr/tweakpane-plugin-profiler/dist/types/ProfilerApi.js';
	import type { Theme } from '$lib/theme.js';

	// re-exported
	export let disabled: boolean = false;
	export let label: string | undefined = undefined;
	export let theme: Theme | undefined = undefined;

	// special case function export
	export function measure(name: string, fn: () => void): void {
		profilerBlade?.measure(name, fn);
	}

	//unique
	export let bufferSize: number | undefined = undefined;
	export let calcMode: ('frame' | 'mean' | 'median') | undefined = undefined;
	export let deltaUnit: string | undefined = undefined;
	export let fractionDigits: number | undefined = undefined;
	export let measureHandler: ProfilerBladeMeasureHandler | undefined = undefined;
	export let targetDelta: number | undefined = undefined;

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

<Blade {disabled} bind:bladeRef={profilerBlade} {bladeParams} {theme} />
