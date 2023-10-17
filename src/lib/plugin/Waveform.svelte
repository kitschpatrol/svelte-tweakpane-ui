<script lang="ts">
	import GenericMonitor from '../internal/GenericMonitor.svelte';
	import type { ComponentProps } from 'svelte';
	import type {
		WaveformStyles,
		WaveformValue
	} from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';

	interface $$Props
		extends Omit<
			ComponentProps<GenericMonitor<WaveformValue>>,
			'bindingParams' | 'bindingRef' | 'plugin'
		> {
		/** TODO Docs */
		max?: number;
		/** TODO Docs */
		min?: number;
		/** TODO Docs */
		lineStyle?: WaveformStyles;
		/** TODO Docs */
		value: WaveformValue;
	}

	// unique
	export let value: $$Props['value'];
	export let max: $$Props['max'] = undefined;
	export let min: $$Props['min'] = undefined;
	export let lineStyle: $$Props['lineStyle'] = undefined;

	$: bindingParams = {
		view: 'waveform',
		max,
		min,
		lineStyle
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

{#await import('tweakpane-plugin-waveform') then module}
	<GenericMonitor {bindingParams} {value} plugin={module} {...$$restProps} />
{/await}
