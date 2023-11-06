<script lang="ts" context="module">
	import type { Simplify } from '$lib/utils';

	export type CubicBezierValueObject = {
		x1: number;
		y1: number;
		x2: number;
		y2: number;
	};
	export type CubicBezierValueTuple = [x1: number, y1: number, x2: number, y2: number];
	export type CubicBezierValue = Simplify<CubicBezierValueObject | CubicBezierValueTuple>;
</script>

<script lang="ts">
	import GenericBladeFolding from '$lib/internal/GenericBladeFolding.svelte';
	import type { CubicBezierApi as CubicBezierRef } from '@tweakpane/plugin-essentials';
	import * as pluginModule from '@tweakpane/plugin-essentials';
	import { CubicBezier } from '@tweakpane/plugin-essentials';
	import type { CubicBezierBladeParams as CubicBezierOptions } from '@tweakpane/plugin-essentials/dist/types/cubic-bezier/plugin.d.ts';
	import { BROWSER } from 'esm-env';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<
		ComponentProps<GenericBladeFolding<CubicBezierOptions, CubicBezierRef>>,
		'buttonClass' | 'ref' | 'options' | 'plugin'
	> & {
		/**
		 * The cubic bezier value to control.
		 *
		 * Object value type is a convenience added by `svelte-tweakpane-ui`, and is not part of the original `@tweakpane/plugin-essentials` API.
		 * @type {CubicBezierValue}
		 * @bindable
		 */
		value: CubicBezierValue;
		/**
		 * Text displayed next to the control.
		 * @default `undefined`
		 * */
		label?: string;
	};

	// reexport for bindability
	export let label: $$Props['label'] = undefined;
	export let value: $$Props['value'];
	export let expanded: $$Props['expanded'] = undefined;

	let options: CubicBezierOptions;
	let cubicBezierBlade: CubicBezierRef;

	// work-arounds for funky folding
	const buttonClass = 'tp-cbzv_b';

	function getValue(): CubicBezierOptions['value'] {
		if (Array.isArray(value)) {
			return value;
		} else {
			return [value.x1, value.y1, value.x2, value.y2];
		}
	}

	function setValue() {
		if (Array.isArray(value)) {
			cubicBezierBlade.value = new CubicBezier(value[0], value[1], value[2], value[3]);
		} else {
			cubicBezierBlade.value = new CubicBezier(value.x1, value.y1, value.x2, value.y2);
		}
	}

	function addEvent() {
		cubicBezierBlade.on('change', (ev) => {
			if (Array.isArray(value)) {
				value = [ev.value.x1, ev.value.y1, ev.value.x2, ev.value.y2];
			} else {
				value = {
					x1: ev.value.x1,
					x2: ev.value.x2,
					y1: ev.value.y1,
					y2: ev.value.y2
				};
			}
		});
	}

	$: BROWSER &&
		(options = {
			view: 'cubicbezier',
			label,
			value: getValue()
		});
	$: BROWSER && cubicBezierBlade && addEvent();
	$: value, BROWSER && cubicBezierBlade && setValue();
</script>

<!--
@component
TODO

@example
```svelte
<script lang="ts">
  import {
    CubicBezier,
    Slider,
    RadioGrid,
    type CubicBezierValue,
    Utils
  } from 'svelte-tweakpane-ui';
  import { tweened } from 'svelte/motion';

  // could also be a tuple
  let value: CubicBezierValue = { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1.0 };
  let duration = 1000;
  let moods = ['Set', 'Rise'];
  let mood: string = moods[0];

  const positionTween = tweened(0);

  function lerp(value: number, toLow: number, toHigh: number): number {
    return toLow + ((value - 0) * (toHigh - toLow)) / (1 - 0);
  }

  $: positionTween.set(mood === 'Set' ? 0 : 1, {
    duration,
    easing: Utils.cubicBezierToEaseFunction(value)
  });

  $: celestialHeight = lerp($positionTween, 20, 80);
  $: twilightAmount = lerp($positionTween, 20, -80);
</script>

<CubicBezier bind:value picker="inline" expanded={true} />
<Slider
  label="Duration (Seconds)"
  bind:value={duration}
  min={0}
  max={10000}
  format={(v) => `${(v / 1000).toFixed(1)}`}
/>
<RadioGrid bind:value={mood} values={['Rise', 'Set']} />

<div class="demo" style:--a="{twilightAmount}%">
  <div class="celestial-object" style:--t="{celestialHeight}%" />
</div>

<style>
  .demo {
    width: 100%;
    aspect-ratio: 1;
    background: linear-gradient(to top, orange var(--a), magenta 100%);
    position: relative;
    overflow: hidden;
  }

  .celestial-object {
    position: absolute;
    left: 50%;
    bottom: var(--t);
    transform-origin: center;
    transform: translate(-50%, 50%);
    width: 10cqw;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: yellow;
  }
</style>
```

@sourceLink [CubicBezier.svelte](https://github.com/kitschpatrol/svelte-tweakpane-ui/blob/main/src/lib/plugin/essentials/CubicBezier.svelte)
-->

{#if BROWSER}
	<GenericBladeFolding
		bind:expanded
		bind:ref={cubicBezierBlade}
		plugin={pluginModule}
		{buttonClass}
		{options}
		{...$$restProps}
	/>
{/if}

<style>
	/* Fix overflow bug from the plugin TODO PR */
	:global(div.tp-cbzv:not(tp-cbzv-expanded) div.tp-cbzv_p) {
		overflow: hidden !important;
	}
</style>
