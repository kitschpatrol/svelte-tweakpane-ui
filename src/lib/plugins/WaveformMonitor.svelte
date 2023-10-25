<script lang="ts">
	import GenericMonitor from '../internal/GenericMonitor.svelte';
	import * as pluginModule from 'tweakpane-plugin-waveform';
	import type { GenericMonitorOptions } from '../internal/GenericMonitor.svelte';
	import type { ComponentProps } from 'svelte';
	import { BROWSER } from 'esm-env';
	import type {
		WaveformStyles as WaveformMonitorLineStyle,
		WaveformValue as WaveformMonitorValue
	} from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';

	// Direct prop import is wrapped in some extra stuff we don't want
	// import type { WaveformProps } from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';
	type WaveformMonitorOptions = GenericMonitorOptions & {
		max?: number;
		min?: number;
		lineStyle?: WaveformMonitorLineStyle;
	};

	type $$Props = Omit<
		ComponentProps<GenericMonitor<WaveformMonitorValue, WaveformMonitorOptions>>,
		'options' | 'ref' | 'plugin'
	> & {
		/**
		 * Maximum graph bound.
		 * @default `100`
		 * */
		max?: number;
		/**
		 * Minimum graph bound.
		 * @default `0`
		 * */
		min?: number;
		/**
		 * Maximum graph bound.
		 * @default `'linear''`
		 * */
		lineStyle?: 'linear' | 'bezier';
		/**
		 * Waveform values.
		 * @bindable
		 * */
		value: Uint8Array | Uint16Array | Uint32Array | number[];
	};

	// unique
	export let value: $$Props['value'];
	export let max: $$Props['max'] = undefined;
	export let min: $$Props['min'] = undefined;
	export let lineStyle: $$Props['lineStyle'] = undefined;

	let options: WaveformMonitorOptions;

	$: BROWSER &&
		(options = {
			view: 'waveform',
			max,
			min,
			lineStyle
		});
</script>

<!--
@component
TODO
Integrates [Simon Schödler's](https://shoedler.github.io) [tweakpane-plugin-waveform](https://github.com/shoedler/tweakpane-plugin-waveform).

Note that `svelte-tweakpane-ui` embeds a [fork](https://github.com/kitschpatrol/tweakpane-plugin-waveform) of the plugin with support for Tweakpane 4. The depdnency will be updated to point to the source repository if / when the open [pull request](https://github.com/shoedler/tweakpane-plugin-waveform/pull/2) with Tweakpane 4 support is merged.

@example
```tsx
TODO
```

@sourceLink
-->

{#if BROWSER}
	<GenericMonitor {options} {value} plugin={pluginModule} {...$$restProps} />
{/if}
