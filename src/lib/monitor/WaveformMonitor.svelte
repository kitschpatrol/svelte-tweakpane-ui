<script context="module" lang="ts">
	export type WaveformMonitorValue = Uint8Array | Uint16Array | Uint32Array | number[];
</script>

<script lang="ts">
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-waveform';
	import type { WaveformStyles as WaveformMonitorLineStyle } from '@kitschpatrol/tweakpane-plugin-waveform/dist/types/view/waveform.js';
	import ClsPad from '$lib/internal/ClsPad.svelte';
	import type { GenericMonitorOptions } from '$lib/internal/GenericMonitor.svelte';
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import { fillWith } from '$lib/utils';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	// Direct prop import is wrapped in some extra stuff we don't want import type { WaveformProps }
	// from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';
	type WaveformMonitorOptions = {
		min?: number;
		max?: number;
		lineStyle?: WaveformMonitorLineStyle;
	} & GenericMonitorOptions;

	type $$Props = {
		/**
		 * Waveform values.
		 * @bindable
		 * */
		value: WaveformMonitorValue;
		/**
		 * Minimum graph bound.
		 * @default `0`
		 * */
		min?: number;
		/**
		 * Maximum graph bound.
		 * @default `100`
		 * */
		max?: number;
		/**
		 * Line style.
		 * @default `'linear''`
		 * */
		lineStyle?: 'bezier' | 'linear';
	} & Omit<
		ComponentProps<GenericMonitor<WaveformMonitorValue, WaveformMonitorOptions>>,
		'options' | 'plugin' | 'ref'
	>;

	// Unique
	export let value: $$Props['value'];
	export let max: $$Props['max'] = undefined;
	export let min: $$Props['min'] = undefined;
	export let lineStyle: $$Props['lineStyle'] = undefined;

	let options: WaveformMonitorOptions;

	$: options = {
		min,
		max,
		lineStyle,
		readonly: true,
		view: 'waveform'
	};
</script>

<!--
@component  
Visualize multiple numeric values as a waveform.

Integrates [Simon Schödler's](https://shoedler.github.io)
[tweakpane-plugin-waveform](https://github.com/shoedler/tweakpane-plugin-waveform).

See `<Monitor>` component if you want to graph a single value's change over time.

Usage outside of a `<Pane>` component will implicitly wrap the waveform monitor in `<Pane
position="inline">`.

Note that _Svelte Tweakpane UI_ embeds a functionally identical [fork](https://github.com/kitschpatrol/tweakpane-plugin-waveform) of the plugin with build optimizations.

@example  
```svelte
<script lang="ts">
  import { WaveformMonitor } from 'svelte-tweakpane-ui';

  let waveData = [5, 6, 7, 8, 9, 3, 9, 8, 7, 6, 5];

  setInterval(() => {
    waveData = waveData.map((v) =>
      Math.max(0, Math.min(10, v + (Math.random() * 2 - 1) * 0.5))
    );
  }, 10);
</script>

<WaveformMonitor value={waveData} min={-1} max={11} lineStyle={'bezier'} />
```

@sourceLink
[WaveformMonitor.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/monitor/WaveformMonitor.svelte)
-->

<GenericMonitor {value} {options} plugin={pluginModule} {...$$restProps} />
{#if !BROWSER}
	<ClsPad keysAdd={fillWith('containerUnitSize', 2)} theme={$$props.theme} />
{/if}
