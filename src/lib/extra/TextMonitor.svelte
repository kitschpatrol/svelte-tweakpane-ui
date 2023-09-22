<script lang="ts">
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import type {
		WaveformValue,
		WaveformStyles
	} from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';

	// re-exported
	export let value: string;
	export let label: string | undefined = undefined;
	export let disabled: boolean = false;
	export let rows: number | undefined = undefined;
	export let bufferSize: number | undefined = undefined;

	// unique
	// "scrollable" might be a better name
	export let multiline: boolean | undefined = undefined;

	$: bindingParams = {
		multiline
	};
</script>

<GenericMonitor {rows} {bufferSize} {label} {disabled} {bindingParams} {value} />
