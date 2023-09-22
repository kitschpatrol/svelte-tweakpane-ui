<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import type {
		WaveformValue,
		WaveformStyles
	} from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let value: WaveformValue;

	// unique
	export let max: number;
	export let min: number;
	export let lineStyle: WaveformStyles;

	$: bindingParams = {
		view: 'waveform',
		max,
		min,
		lineStyle
	};
</script>

<GenericMonitor interval={-1} {label} {disabled} {bindingParams} {value} />
