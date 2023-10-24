<script lang="ts" context="module">
	import type {
		WaveformStyles,
		WaveformValue
	} from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';
	export type WaveformMonitorLineStyle = WaveformStyles;
	export type WaveformMonitorValue = WaveformValue;
</script>

<script lang="ts">
	import GenericMonitor from '../internal/GenericMonitor.svelte';
	import * as pluginModule from 'tweakpane-plugin-waveform';
	import type { GenericMonitorOptions } from '../internal/GenericMonitor.svelte';
	import type { ComponentProps } from 'svelte';
	// Direct prop import is wrapped in some extra stuff we don't want
	// import type { WaveformProps } from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';
	type WaveformMonitorOptions = GenericMonitorOptions & {
		max: number;
		min: number;
		lineStyle: WaveformMonitorLineStyle;
	};

	interface $$Props
		extends Omit<
			ComponentProps<GenericMonitor<WaveformMonitorValue, WaveformMonitorOptions>>,
			'options' | 'ref' | 'plugin'
		> {
		/** TODO Docs */
		max?: number;
		/** TODO Docs */
		min?: number;
		/** TODO Docs */
		lineStyle?: WaveformMonitorLineStyle;
		/** TODO Docs */
		value: WaveformMonitorValue;
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
	} as WaveformMonitorOptions;
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

<GenericMonitor {options} {value} plugin={pluginModule} {...$$restProps} />
