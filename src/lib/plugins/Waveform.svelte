<script lang="ts" context="module">
	import type {
		WaveformStyles,
		WaveformValue
	} from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';
	export type WaveformLineStyle = WaveformStyles;
	export type { WaveformValue };
</script>

<script lang="ts">
	import GenericMonitor from '../internal/GenericMonitor.svelte';
	import type { GenericMonitorOptions } from '../internal/GenericMonitor.svelte';
	import type { ComponentProps } from 'svelte';
	// Direct prop import is wrapped in some extra stuff we don't want
	// import type { WaveformProps } from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';
	type WaveformOptions = GenericMonitorOptions & {
		max: number;
		min: number;
		lineStyle: WaveformLineStyle;
	};

	interface $$Props
		extends Omit<
			ComponentProps<GenericMonitor<WaveformValue, WaveformOptions>>,
			'options' | 'ref' | 'plugin'
		> {
		/** TODO Docs */
		max?: number;
		/** TODO Docs */
		min?: number;
		/** TODO Docs */
		lineStyle?: WaveformLineStyle;
		/** TODO Docs */
		value: WaveformValue;
	}

	// unique
	export let value: $$Props['value'];
	export let max: $$Props['max'] = undefined;
	export let min: $$Props['min'] = undefined;
	export let lineStyle: $$Props['lineStyle'] = undefined;

	$: options = {
		view: 'waveform',
		max,
		min,
		lineStyle
	} as WaveformOptions;
</script>

<!--
@component
TODO

Example:
```tsx
TODO
```
-->

{#await import('tweakpane-plugin-waveform') then module}
	<GenericMonitor {options} {value} plugin={module} {...$$restProps} />
{/await}
