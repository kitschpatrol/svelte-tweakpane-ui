<script lang="ts">
	import * as pluginModule from '@kitschpatrol/tweakpane-plugin-waveform';
	import type {
		WaveformStyles as WaveformMonitorLineStyle,
		WaveformValue as WaveformMonitorValue
	} from '@kitschpatrol/tweakpane-plugin-waveform/dist/types/view/waveform.js';
	import type { GenericMonitorOptions } from '$lib/internal/GenericMonitor.svelte';
	import GenericMonitor from '$lib/internal/GenericMonitor.svelte';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	// Direct prop import is wrapped in some extra stuff we don't want import type { WaveformProps }
	// from 'tweakpane-plugin-waveform/dist/types/view/waveform.js';
	type WaveformMonitorOptions = GenericMonitorOptions & {
		min?: number;
		max?: number;
		lineStyle?: WaveformMonitorLineStyle;
	};

	type $$Props = Omit<
		ComponentProps<GenericMonitor<WaveformMonitorValue, WaveformMonitorOptions>>,
		'options' | 'plugin' | 'ref'
	> & {
		/**
		 * Waveform values.
		 * @bindable
		 * */
		value: Uint8Array | Uint16Array | Uint32Array | number[];
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
	};

	// unique
	export let value: $$Props['value'];
	export let max: $$Props['max'] = undefined;
	export let min: $$Props['min'] = undefined;
	export let lineStyle: $$Props['lineStyle'] = undefined;

	let options: WaveformMonitorOptions;

	$: BROWSER &&
		(options = {
			min,
			max,
			lineStyle,
			view: 'waveform'
		});
</script>

<!--
@component  
TODO Component documentation...

TK Integrates [Simon Schödler's](https://shoedler.github.io)
[tweakpane-plugin-waveform](https://github.com/shoedler/tweakpane-plugin-waveform).

Note that `svelte-tweakpane-ui` embeds a
[fork](https://github.com/kitschpatrol/tweakpane-plugin-waveform) of the plugin with support for
Tweakpane 4. The depdnency will be updated to point to the source repository if / when the open
[pull request](https://github.com/shoedler/tweakpane-plugin-waveform/pull/2) with Tweakpane 4
support is merged.

@example  
```svelte
<script lang="ts">
  import { WaveformMonitor } from 'svelte-tweakpane-ui';

  let smallNumberArray = [5, 6, 7, 8, 9, 3, 9, 8, 7, 6, 5];
  let uint8Array = new Uint8Array(8)
    .fill(0)
    .map((_, i) => Math.pow(2, i + 1) - 1);
  let uint16Array = new Uint16Array(16)
    .fill(0)
    .map((_, i) => Math.pow(2, i + 1) - 1);
  let uint32Array = new Uint32Array(32)
    .fill(0)
    .map((_, i) => Math.pow(2, i + 1) - 1);

  setInterval(() => {
    smallNumberArray = smallNumberArray.map((v) =>
      Math.max(0, Math.min(10, v + (Math.random() * 2 - 1) * 0.5))
    );
    uint8Array = uint8Array.map((v) => ++v);
    uint16Array = uint16Array.map((v) => v + 1e2);
    uint32Array = uint32Array.map((v) => v + 1e8);
  }, 10);
</script>

<WaveformMonitor
  value={smallNumberArray}
  min={-1}
  max={11}
  lineStyle={'bezier'}
/>
<WaveformMonitor value={uint8Array} min={0} max={Math.pow(2, 8)} />
<WaveformMonitor value={uint16Array} min={0} max={Math.pow(2, 16)} />
<WaveformMonitor value={uint32Array} min={0} max={Math.pow(2, 32)} />
```

@sourceLink
[WaveformMonitor.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/WaveformMonitor.svelte)
-->

{#if BROWSER}
	<GenericMonitor {value} {options} plugin={pluginModule} {...$$restProps} />
{/if}
