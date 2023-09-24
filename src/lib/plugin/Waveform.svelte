<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import type {
		WaveformValue,
		WaveformStyles
	} from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';
	import type { Theme } from '$lib/theme.js';

	// re-exported
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let theme: Theme | undefined = undefined;
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

<GenericMonitor {label} {disabled} {bindingParams} {value} {theme} />
